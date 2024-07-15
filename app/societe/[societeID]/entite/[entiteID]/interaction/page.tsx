'use client'

import { useEffect, useState, useCallback } from 'react'
import List from '@/components/list'
import { Pagination } from '@/components/pagination'
import PopUp from '@/components/popUp'
import withAuthorization from '@/components/withAuthorization'
import style from '../../../../../../styles/components.module.css'
import TypesButtons from '@/components/TypesButtons'

export interface Interactions {
    code_interaction: number
    code_Utilisateur_Prospecteur: number
    code_Entite_Prospectee: number
    date_interaction: Date
    code_type_interaction: string
    code_modalite_interaction: string
    code_contact_entite: number
    commentaires: string
    pieces_associees: Blob
    date_relance: Date
}

function InteractionsPage({
    params,
}: {
    params: { societeID: string; entiteID: string }
}) {
    const [Interactions, setInteractions] = useState<Interactions[]>([])
    const [page, setPage] = useState(1) // new state for the current page
    const [totalItems, setTotalItems] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(3)
    const [search, setSearch] = useState<Interactions[]>([])

    const [codeUtilisateurProspecteur, setCodeUtilisateurProspecteur] =
        useState('')
    const [dateInteraction, setDateInteraction] = useState(new Date())
    const [codeTypeInteraction, setCodeTypeInteraction] = useState('')
    const [codeModaliteInteraction, setCodeModaliteInteraction] = useState('')
    const [codeContactEntiteInteraction, setCodeContactEntiteInteraction] =
        useState('')
    const [commentaires, setCommentaires] = useState('')
    const today = new Date()
    const [dateRelance, setDateRelance] = useState(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
    )

    const [isPopUpOpen, setIsPopUpOpen] = useState(false)

    const handleClose = () => {
        setIsPopUpOpen(false)
    }

    const handleCodeTypeInteraction = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setCodeTypeInteraction(event.target.value)
    }

    const handleCodeModaliteInteraction = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setCodeModaliteInteraction(event.target.value)
    }

    const handleCodeContactEntiteInteraction = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setCodeContactEntiteInteraction(event.target.value)
    }

    const handleCodeUtilisateurProspecteur = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCodeUtilisateurProspecteur(event.target.value)
    }

    const handleDateInteraction = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setDateInteraction(new Date(event.target.value))
    }

    const handleCommentaires = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCommentaires(event.target.value)
    }

    const handleDateRelance = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDateRelance(new Date(event.target.value))
    }

    const [fields, setFields] = useState<
        {
            id: string
            type: FieldType
            value: string | null
            placeholder?: string
            url?: string
            createURL?: string
            required?: boolean
            maxLength?: number
            onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
            onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
        }[]
    >([])

    type FieldType =
        | 'number'
        | 'search'
        | 'date'
        | 'select'
        | 'input'
        | 'file'
        | 'checkbox'
        | 'enum'

    const generateFields = useCallback(() => {
        const fields: {
            id: string
            type: FieldType
            value: string | null
            placeholder?: string
            url?: string
            createURL?: string
            required?: boolean
            disabled?: boolean
            maxLength?: number
            onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
            onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
        }[] = [
            {
                id: 'code_Entite_Prospectee',
                type: 'input',
                value: params.entiteID,
                disabled: true,
                required: true,
            },
            {
                id: 'code_Utilisateur_Prospecteur',
                type: 'search',
                value: codeUtilisateurProspecteur,
                url: '../../../../../api/select/sites/utilisateurs',
                required: true,
                onInputChange: handleCodeUtilisateurProspecteur,
            },
            {
                id: 'date_interaction',
                type: 'date',
                value: dateInteraction.toISOString().split('T')[0],
                required: true,
                onInputChange: handleDateInteraction,
            },
            {
                id: 'code_type_interaction',
                type: 'select',
                value: codeTypeInteraction,
                url: `../../../../../api/societe/${params.societeID}/entite/${params.entiteID}/interactions/type-interactions`,
                required: true,
                onChange: handleCodeTypeInteraction,
            },
            {
                id: 'code_modalite_interaction',
                type: 'select',
                value: codeModaliteInteraction,
                url: `../../../../../api/societe/${params.societeID}/entite/${params.entiteID}/interactions/type-modalite-interactions`,
                required: true,
                onChange: handleCodeModaliteInteraction,
            },
            {
                id: 'code_contact_entite',
                type: 'select',
                value: codeContactEntiteInteraction,
                url: `../../../../../api/select/societe/entite/${params.entiteID}/contact`,
                required: true,
                onChange: handleCodeContactEntiteInteraction,
            },
            {
                id: 'commentaires',
                type: 'input',
                value: commentaires,
                placeholder: 'Exemple: Relance pour aide a Dunkerque',
                maxLength: 200,
                onInputChange: handleCommentaires,
            },
            {
                id: 'pieces_associees',
                type: 'file',
                value: null,
            }, // type blob
            {
                id: 'date_relance',
                type: 'date',
                value: dateRelance.toISOString().split('T')[0],
                required: true,
                onInputChange: handleDateRelance,
            },
        ]

        return fields
    }, [
        codeUtilisateurProspecteur,
        codeModaliteInteraction,
        codeContactEntiteInteraction,
        codeTypeInteraction,
        commentaires,
        dateInteraction,
        dateRelance,
        params.entiteID,
        params.societeID,
    ])

    useEffect(() => {
        const fetchInteractions = async () => {
            const res = await fetch(
                `http://localhost:3000/api/societe/${params.societeID}/entite/${params.entiteID}/interactions?page=${page}&limit=${itemsPerPage}`,
            )

            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }
            const { data, total }: { data: Interactions[]; total: number } =
                await res.json()
            setInteractions(data)
            setTotalItems(total)
            setFields(generateFields())
        }

        const fetchSearchInteractions = async () => {
            if (search.length === 0) {
                const res = await fetch(
                    `http://localhost:3000/api/societe/${params.societeID}/entite/${params.entiteID}/interactions?limit=10000`,
                )

                if (!res.ok) {
                    throw new Error('Failed to fetch data')
                }

                const { data }: { data: Interactions[] } = await res.json()
                setSearch(data)
            }
        }

        fetchInteractions()
        fetchSearchInteractions()
    }, [
        page,
        itemsPerPage,
        params.societeID,
        params.entiteID,
        search,
        generateFields,
    ])
    // add a function to handle page changes
    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage)
        setPage(1)
    }

    return (
        <>
            <div className={style.page}>
                <h1 className={style.lg}>Interactions</h1>
                <List
                    items={Interactions.map(Interactions => ({
                        value1: Interactions.code_interaction.toString(),
                        value2: Interactions.code_Entite_Prospectee.toString(),
                        value3: Interactions.date_interaction
                            .toString()
                            .split('T')[0],
                        value4: Interactions.code_contact_entite.toString(),
                        value5: Interactions.date_relance
                            .toString()
                            .split('T')[0],
                        value6: Interactions.commentaires,
                    }))}
                    functions={{
                        fonc1: () => {
                            isPopUpOpen
                                ? setIsPopUpOpen(false)
                                : setIsPopUpOpen(true)
                        },
                        url: `http://localhost:3000/api/societe/${params.societeID}/entite/${params.entiteID}/interactions`,
                    }}
                    attribut={{
                        att1: 'Code interaction',
                        att2: 'Date interaction',
                        att3: 'Code contact entité',
                        att4: 'Date relance',
                        att5: 'Commentaire',
                    }}
                    searchItems={search.map(Interactions => ({
                        value1: Interactions.code_interaction.toString(),
                        value2: Interactions.code_Entite_Prospectee.toString(),
                        value3: Interactions.date_interaction
                            .toString()
                            .split('T')[0],
                        value4: Interactions.code_contact_entite.toString(),
                        value5: Interactions.date_relance
                            .toString()
                            .split('T')[0],
                        value6: Interactions.commentaires,
                    }))}
                />
                <Pagination
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={page}
                />
                {''}
                {isPopUpOpen && (
                    <div className={style.PopUp}>
                        <PopUp
                            onClose={handleClose}
                            url={`http://localhost:3000/api/societe/${params.societeID}/entite/${params.entiteID}/interactions`}
                            fields={fields}
                        />
                    </div>
                )}
                <TypesButtons
                    items={[
                        {
                            label: `Types d'interactions`,
                            url: 'type-interactions',
                        },
                        {
                            label: `Types de modalités d'interactions`,
                            url: 'type-modalite-interactions',
                        },
                    ]}
                />
            </div>
        </>
    )
}
export default withAuthorization(InteractionsPage, ['AD', 'PR'])
