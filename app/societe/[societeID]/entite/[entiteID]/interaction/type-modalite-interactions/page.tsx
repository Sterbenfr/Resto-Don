'use client'
import { useEffect, useState } from 'react'
import List from '@/components/list'
import PopUp from '@/components/popUp'
import withAuthorization from '@/components/withAuthorization'
import style from '../../../../../../../styles/components.module.css'
import Image from 'next/image'

export interface Modalite_Interactions {
    id: string
    label: string
}

function Modalites_InteractionsPage({
    params,
}: {
    params: { societeID: string; entiteID: string }
}) {
    const [Modalites_Interactions, setModalites_Interactions] = useState<
        Modalite_Interactions[]
    >([])

    const [isPopUpOpen, setIsPopUpOpen] = useState(false)

    const handleClose = () => {
        setIsPopUpOpen(false)
    }

    useEffect(() => {
        const fetchModalites_Interactions = async () => {
            const res = await fetch(
                `../../../../../../api/societe/${params.societeID}/entite/${params.entiteID}/interactions/type-modalite-interactions`,
            )

            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }

            const Modalites_Interactions: Modalite_Interactions[] =
                await res.json()
            setModalites_Interactions(Modalites_Interactions)
        }

        fetchModalites_Interactions()
    }, [params.societeID, params.entiteID])
    return (
        <>
            <div className={style.page}>
                <div className={style.croixID}>
                    <h1 className={style.lg1}>
                        Types de modalités d&apos;interactions
                    </h1>
                    <a href='javascript:history.go(-1)' className={style.btnC}>
                        <Image
                            className={style.CR}
                            src='/IMG/return.svg'
                            height={30}
                            width={30}
                            alt='Fermer la fenêtre'
                        />
                    </a>
                </div>

                <List
                    items={Modalites_Interactions.map(ModalitesInteraction => ({
                        value1: ModalitesInteraction.id.toString(),
                        value2: ModalitesInteraction.id.toString(),
                        value3: ModalitesInteraction.label,
                    }))}
                    functions={{
                        fonc1: () => {
                            isPopUpOpen
                                ? setIsPopUpOpen(false)
                                : setIsPopUpOpen(true)
                        },
                        url: `../../../../../../api/societe/${params.societeID}/entite/${params.entiteID}/interactions/type-modalite-interactions`,
                    }}
                    attribut={{
                        att1: 'Code',
                        att2: 'Libellé',
                    }}
                />
                {isPopUpOpen && (
                    <div className={style.PopUpType}>
                        <PopUp
                            onClose={handleClose}
                            url={`../../../../../../api/societe/${params.societeID}/entite/${params.entiteID}/interactions/type-modalite-interactions`}
                            fields={[
                                {
                                    id: 'code_modalite_interaction',
                                    type: 'input',
                                    value: null,
                                    required: true,
                                    maxLength: 4,
                                },
                                {
                                    id: 'libelle',
                                    type: 'input',
                                    value: null,
                                    required: true,
                                    maxLength: 50,
                                },
                            ]}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
export default withAuthorization(Modalites_InteractionsPage, ['AD', 'SU'])
