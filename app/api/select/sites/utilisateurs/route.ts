import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/authOptions'
import connection from '../../../../../utils/db'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.redirect(new URL('/error/not-access', request.url))
    }
    try {
        const [rows] = await connection.query(
            "Select code_utilisateur as id, CONCAT(prenom,' ',nom) as label from Utilisateurs;",
        )
        return NextResponse.json(rows)
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + err },
            { status: 500 },
        )
    }
}
