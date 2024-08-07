import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../auth/[...nextauth]/authOptions'
import connection from '../../../../../../utils/db'

export async function GET(
    request: Request,
    { params }: { params: { donsID: string } },
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.redirect(new URL('/error/not-access', request.url))
    }
    try {
        const [rows] = await connection.query(
            'Select numero_livraison as id, CONCAT(Dons.titre_don," - Livraison ",numero_livraison) as label FROM ModalitesLivraison LEFT JOIN Dons ON ModalitesLivraison.code_don = Dons.code_don WHERE ModalitesLivraison.code_don = ?;',
            [params.donsID],
        )
        return NextResponse.json(rows)
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal Server Error : ' + err },
            { status: 500 },
        )
    }
}
