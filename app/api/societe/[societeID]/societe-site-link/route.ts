import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/authOptions'
import connection from '../../../../../utils/db'

import { streamToString } from '../../../../../utils/streamUtils'
import { ContactSociete } from '@/app/societe/[societeID]/societe-site-link/page'

type CountResult = { count: number }[]

export async function GET(
    request: Request,
    { params }: { params: { societeID: string } },
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.redirect(new URL('/error/not-access', request.url))
    }
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    try {
        const pageNumber = Number(page)
        const limitNumber = Number(limit)
        const offset = (pageNumber - 1) * limitNumber
        const [rows] = await connection.query(
            'SELECT SuiviSociete.*, Entreprise.raison_sociale, SiteTypes.libelle, Sites.designation_longue, CONCAT(Utilisateurs.nom," ",Utilisateurs.prenom) as name FROM `SuiviSociete` LEFT JOIN Entreprise ON Entreprise.code_societe = SuiviSociete.code_societe LEFT JOIN SiteTypes ON SiteTypes.code_type_Site = SuiviSociete.code_type_de_Site LEFT JOIN Sites ON Sites.code_site = SuiviSociete.code_site_suivi LEFT JOIN Utilisateurs ON Utilisateurs.code_utilisateur = SuiviSociete.code_utilisateur_suivant WHERE SuiviSociete.code_Societe = ? LIMIT ?, ?',
            [params.societeID, offset, limitNumber],
        )

        const [totalResult] = await connection.query(
            'SELECT COUNT(*) as count FROM `SuiviSociete` WHERE code_Societe = ?',
            [params.societeID],
        )
        const total = totalResult as CountResult

        return NextResponse.json({ data: rows, total: total[0].count })
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + err },
            { status: 500 },
        )
    }
}

export async function POST(req: NextRequest) {
    let contact: ContactSociete
    try {
        contact = JSON.parse(await streamToString(req.body))
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (
        !contact.code_Societe ||
        !contact.code_type_de_Site ||
        !contact.code_site_suivi ||
        !contact.code_utilisateur_suivant
    ) {
        return NextResponse.json(
            { error: 'Missing product data' },
            { status: 400 },
        )
    }

    try {
        const query = 'INSERT INTO `SuiviSociete` SET ?'
        const [rows] = await connection.query(query, contact)
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + error },
            { status: 500 },
        )
    }
}
