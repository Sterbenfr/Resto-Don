import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/authOptions'
import connection from '../../../../../utils/db'

import { streamToString } from '../../../../../utils/streamUtils'
import type { Reception } from '@/app/dons/[donsID]/reception/page'

type CountResult = { count: number }[]

export async function GET(
    request: Request,
    { params }: { params: { donsID: string } },
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.redirect(new URL('/error/not-access', request.url))
    }
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const donsID = params.donsID

    try {
        const pageNumber = Number(page)
        const limitNumber = Number(limit)
        const offset = (pageNumber - 1) * limitNumber

        const [rows] = await connection.query(
            'SELECT * FROM `Reception` WHERE code_Don = ? LIMIT ?, ?',
            [donsID, offset, limitNumber],
        )

        const [totalResult] = await connection.query(
            'SELECT COUNT(*) as count FROM `Reception` WHERE code_Don = ?',
            [donsID],
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
    let reception: Reception
    try {
        reception = JSON.parse(await streamToString(req.body))
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    if (
        !reception.date_reception ||
        !reception.code_Don ||
        !reception.numero_livraison
    ) {
        return NextResponse.json(
            { error: 'Missing reception data' },
            { status: 400 },
        )
    }

    try {
        const query = 'INSERT INTO `Reception` SET ?'
        const [rows] = await connection.query(query, reception)
        return NextResponse.json(rows)
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + error },
            { status: 500 },
        )
    }
}
