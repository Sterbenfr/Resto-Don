import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'
import connection from '../../../utils/db'

import { streamToString } from '../../../utils/streamUtils'
import type { Prestataire } from '@/app/prestataire/page'

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
            'SELECT Prestataires.*,TypePrestataires.libelle as label_type_prestataire FROM `Prestataires` LEFT JOIN TypePrestataires ON TypePrestataires.code_type_de_Prestataire = Prestataires.code_type_de_Prestataire ORDER BY `code_Prestataire` DESC LIMIT ?, ?',
            [offset, limitNumber],
        )

        const [totalResult] = await connection.query(
            'SELECT COUNT(*) as count FROM `Prestataires`',
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
export async function POST(req: NextRequest) {
    let prestataires: Prestataire
    try {
        prestataires = JSON.parse(await streamToString(req.body))
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (
        !prestataires.code_type_de_Prestataire ||
        !prestataires.raison_sociale
    ) {
        return NextResponse.json(
            { error: 'Missing product data' },
            { status: 400 },
        )
    }

    try {
        const query = 'INSERT INTO `Prestataires` SET ?'
        const [rows] = await connection.query(query, prestataires)
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + error },
            { status: 500 },
        )
    }
}
