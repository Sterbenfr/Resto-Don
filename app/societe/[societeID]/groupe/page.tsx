'use client'
import { useEffect, useState } from 'react'
import List from '@/components/list'
import { Pagination } from '../../../../components/pagination'
import PopUp from '@/components/popUp'
import withAuthorization from '@/components/withAuthorization'
import style from '../../../../styles/components.module.css'

export interface Groupe {
    code_Groupe: number
    nom_du_Groupe: string
    Logo: Blob
    site_Web: string
    commentaires: string
    date_arret_activite_du_groupe: Date
}

function GroupesPage({ params }: { params: { societeID: string } }) {
    const [groupes, setGroupes] = useState<Groupe[]>([])
    const [page, setPage] = useState(1) // new state for the current page
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const [isPopUpOpen, setIsPopUpOpen] = useState(false)

    const handleClose = () => {
        setIsPopUpOpen(false)
    }

    useEffect(() => {
        const fetchGroupes = async () => {
            const res = await fetch(
                `http://localhost:3000/api/societe/${params.societeID}/groupe?page=${page}&limit=${itemsPerPage}`,
            )

            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }

            const { data, total }: { data: Groupe[]; total: number } =
                await res.json()
            setGroupes(data)
            setTotalItems(total) // set the total items
        }

        fetchGroupes()
    }, [page, itemsPerPage, params.societeID])

    // add a function to handle page changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setPage(1) // reset page to 1 when items per page changes
    }

    return (
        <div>
            <>
                <div className={style.page}>
                    <h1 className={style.lg}>Groupe</h1>
                    <List
                        items={groupes.map(groupe => ({
                            value1: groupe.code_Groupe.toString(),
                            value2: groupe.nom_du_Groupe,
                            value3: groupe.site_Web,
                            value4: groupe.commentaires,
                            value5:
                                groupe.date_arret_activite_du_groupe == null
                                    ? ''
                                    : groupe.date_arret_activite_du_groupe
                                          .toString()
                                          .split('T')[0],
                        }))}
                        functions={{
                            fonc1: () => {
                                isPopUpOpen
                                    ? setIsPopUpOpen(false)
                                    : setIsPopUpOpen(true)
                            },
                            url: `http://localhost:3000/api/societe/${params.societeID}/groupe`,
                        }}
                    />
                    <Pagination
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange} // pass the new prop here
                        totalItems={totalItems} // use the total items from the state
                        itemsPerPage={itemsPerPage}
                        currentPage={page}
                    />
                    {''}
                    {isPopUpOpen && (
                        <div className={style.PopUp}>
                            <PopUp
                                onClose={handleClose}
                                url={`http://localhost:3000/api/societe/${params.societeID}/groupe`}
                                fields={[
                                    {
                                        id: 'nom_du_Groupe',
                                        type: 'input',
                                        value: null,
                                        placeholder: 'Exemple: Groupe Alpha',
                                    },
                                    {
                                        id: 'Logo',
                                        type: 'file',
                                        value: null,
                                    },
                                    {
                                        id: 'site_Web',
                                        type: 'input',
                                        value: null,
                                        placeholder:
                                            'Exemple: http://www.groupealpha.com',
                                    },
                                    {
                                        id: 'commentaires',
                                        type: 'input',
                                        value: null,
                                        placeholder:
                                            'Exemple: Groupe actif en dons alimentaires',
                                    },
                                    {
                                        id: 'date_arret_activite_du_Groupe',
                                        type: 'date',
                                        value: null,
                                    },
                                ]}
                            />
                        </div>
                    )}
                </div>
            </>
        </div>
    )
}

export default withAuthorization(GroupesPage, ['AD', 'PR'])
