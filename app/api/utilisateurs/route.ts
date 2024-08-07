import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'
import connection from '../../../utils/db'
import { streamToString } from '../../../utils/streamUtils'
import type { Utilisateurs } from '@/app/utilisateurs/page'
import bcrypt from 'bcryptjs'

type CountResult = { count: number }[]

export async function GET(request: Request) {
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
            'SELECT * FROM `Utilisateurs` ORDER BY `code_utilisateur` DESC LIMIT ?, ?',
            [offset, limitNumber],
        )

        const [totalResult] = await connection.query(
            'SELECT COUNT(*) as count FROM `Utilisateurs`',
        )

        const total = totalResult as CountResult

        return NextResponse.json({ data: rows, total: total[0].count })
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 },
        )
    }
}

type extendedUtilisateurs = Utilisateurs & { code_site: string }
export async function POST(req: NextRequest) {
    let Utilisateur: extendedUtilisateurs
    try {
        Utilisateur = JSON.parse(await streamToString(req.body))
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (
        !Utilisateur.civilite ||
        !Utilisateur.nom ||
        !Utilisateur.prenom ||
        !Utilisateur.password ||
        !Utilisateur.code_type_utilisateur
    ) {
        return NextResponse.json(
            { error: 'Missing product data' },
            { status: 400 },
        )
    }
    try {
        Utilisateur.password = await bcrypt.hash(Utilisateur.password, 10)
        const query = 'INSERT INTO `Utilisateurs` SET ?'
        const [rows] = await connection.query(query, Utilisateur)
        return NextResponse.json({ rows })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + error },
            { status: 500 },
        )
    }
}
