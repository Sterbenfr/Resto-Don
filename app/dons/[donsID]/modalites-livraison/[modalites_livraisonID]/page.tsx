'use client'
import { useEffect, useState } from 'react'
import style from '../../../../../styles/components.module.css'
import Image from 'next/image'
import SelectComponent from '@/components/select-component'
import SearchComponent from '@/components/searchComponent'
import { getSession } from 'next-auth/react'
import { Session } from 'next-auth'
import fileUpload, { setFile } from '@/components/fileUploadModify'
import withAuthorization from '@/components/withAuthorization'

interface ExtendedSession extends Session {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
        role?: string
        id?: string
    }
}

interface Modalite_livraisonID {
    numero_livraison: number
    code_Don: number
    code_type_livraison: string
    date_prevue_livraison: Date
    heure_prevue_livraison: string
    adresse_enlevement: string
    civilite_contact_enlevement: string
    nom_contact_enlevement: string
    prenom_contact_enlevement: string
    telephone_contact_enlevement: string
    mail_contact_enlevement: string
    code_Prestataire_transporteur: string
    adresse_livraison: string
    civilite_contact_livraison: string
    nom_contact_livraison: string
    prenom_contact_livraison: string
    telephone_contact_livraison: string
    mail_contact_livraison: string
    nombre_palettes_prevu: string
    nombre_palettes_consignees_prevu: string
    nombre_cartons_prevu: string
    poids_prevu_kg: string
    produits_sur_palettes: string
    temperature_conserv_produits: string
    commentaires: string
    pieces_associees: string
    libelle_type_livraison: string
    raison_sociale_prestataire: string
    raison_sociale_don: string
}

function Modalites_livraisonPage({
    params,
}: {
    params: { donsID: string; modalites_livraisonID: string }
}) {
    const [modalite_livraison, setModalites_livraison] = useState<
        Modalite_livraisonID[]
    >([])
    const [session, setSession] = useState<ExtendedSession | null>(null)
    const [modify, setModify] = useState<boolean>(false)
    const [modifiedModalite_livraison, setModifiedModalite_livraison] =
        useState<Partial<Modalite_livraisonID>>({})
    let [canSubmit] = useState<boolean>(true)

    useEffect(() => {
        const fetchSessionAndModalites_livraison = async () => {
            const sessionData = await getSession()
            setSession(sessionData as ExtendedSession)

            if (params.modalites_livraisonID) {
                const res = await fetch(
                    `../../../../api/dons/${params.donsID}/modalites-livraison/${params.modalites_livraisonID}`,
                )

                if (!res.ok) {
                    throw new Error('Failed to fetch data')
                }

                const modalite_livraisonData: Modalite_livraisonID[] =
                    await res.json()
                setModalites_livraison(modalite_livraisonData)
            }
        }

        fetchSessionAndModalites_livraison()
    }, [params.modalites_livraisonID, params.donsID, modify])

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target

        setModifiedModalite_livraison(prevState => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleTypeLivraisonChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return
        let value = event.target.value

        if (modalite_livraison[0].code_type_livraison !== '' && value === '') {
            value = modalite_livraison[0].code_type_livraison
        }
        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            code_type_livraison: value,
        })
    }

    const handleCiviliteEnlevementChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return

        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            civilite_contact_enlevement: event.target.value,
        })
    }

    const handlePalettesChange = () => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return

        const currentStatus =
            modifiedModalite_livraison.produits_sur_palettes ||
            modalite_livraison[0].produits_sur_palettes

        const newStatus = currentStatus === 'O' ? 'N' : 'O'

        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            produits_sur_palettes: newStatus,
        })
    }

    const handleCiviliteLivraisonChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return

        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            civilite_contact_livraison: event.target.value,
        })
    }

    const handlePrestataireChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return
        let value = event.target.value

        if (
            modalite_livraison[0].code_Prestataire_transporteur !== '' &&
            value === ''
        ) {
            value = modalite_livraison[0].code_Prestataire_transporteur
        }
        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            code_Prestataire_transporteur: value,
        })
    }

    const handleAdresseChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!modalite_livraison || modalite_livraison.length === 0 || !session)
            return
        let value = event.target.value

        if (modalite_livraison[0].adresse_livraison !== '' && value === '') {
            value = modalite_livraison[0].adresse_livraison
        }
        setModifiedModalite_livraison({
            ...modifiedModalite_livraison,
            adresse_livraison: value,
        })
    }

    const formatDate = (dateString: string | number | Date) => {
        return dateString
            ? new Date(dateString).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
    }

    const handleFileChange: React.ChangeEventHandler<
        HTMLInputElement
    > = event => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
        }
    }
    if (
        !Array.isArray(modalite_livraison) ||
        modalite_livraison.length === 0 ||
        typeof modalite_livraison[0]?.numero_livraison === 'undefined'
    )
        return (
            <div className={style.page}>
                <h2 className={style.load}>Chargement...</h2>
            </div>
        )

    const requiredValue = () => {
        const keysToCheck = [
            'code_type_livraison',
            'date_prevue_livraison',
            'heure_prevue_livraison',
            'adresse_enlevement',
            'telephone_contact_enlevement',
            'mail_contact_enlevement',
            'adresse_livraison',
            'telephone_contact_livraison',
            'mail_contact_livraison',
        ]

        keysToCheck.forEach(key => {
            if (
                modifiedModalite_livraison[
                    key as keyof Modalite_livraisonID
                ] === null ||
                modifiedModalite_livraison[
                    key as keyof Modalite_livraisonID
                ] === ''
            ) {
                const input = document.querySelector(`input[name=${key}]`)
                if (input) {
                    input.classList.add(style.isReq)
                }
                setModifiedModalite_livraison(prevState => ({
                    ...prevState,
                    [key]: modalite_livraison[0][
                        key as keyof Modalite_livraisonID
                    ],
                }))
            }
        })
    }

    const handleSubmit = async () => {
        requiredValue()

        if (
            !modifiedModalite_livraison.adresse_enlevement ||
            modifiedModalite_livraison.adresse_enlevement.trim() === '' ||
            !(
                modifiedModalite_livraison.telephone_contact_enlevement ||
                modifiedModalite_livraison.mail_contact_enlevement
            ) ||
            !(
                modifiedModalite_livraison.telephone_contact_livraison ||
                modifiedModalite_livraison.mail_contact_livraison
            )
        ) {
            canSubmit = false
        } else {
            canSubmit = true
        }

        if (canSubmit) {
            const filePaths = await fileUpload('../../../../api/upload/piece')

            const jsonPayload = {
                ...modifiedModalite_livraison,
                pieces_associees: filePaths[0],
            }

            const body = JSON.stringify(jsonPayload)

            try {
                const res = await fetch(
                    `../../../../api/dons/${params.donsID}/modalites-livraison/${params.modalites_livraisonID}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: body,
                    },
                )

                if (!res.ok) {
                    const errorDetail = await res.text()
                    console.error('Failed to update data:', errorDetail)
                    throw new Error('Failed to update data')
                }

                const updatedModalite_livraison: Modalite_livraisonID[] =
                    await res.json()
                setModalites_livraison(updatedModalite_livraison)
                setModify(false)
            } catch (error) {
                console.error('Error submitting form:', error)
            }
            window.location.reload()
        }
    }

    const initialValue = () => {
        const keysToCheck = [
            'heure_prevue_livraison',
            'nom_contact_enlevement',
            'prenom_contact_enlevement',
            'telephone_contact_enlevement',
            'mail_contact_enlevement',
            'adresse_enlevement',
            'nom_contact_livraison',
            'prenom_contact_livraison',
            'telephone_contact_livraison',
            'mail_contact_livraison',
            'nombre_palettes_prevu',
            'nombre_palettes_consignees_prevu',
            'nombre_cartons_prevu',
            'poids_prevu_kg',
            'temperature_conserv_produits',
            'commentaires',
        ]

        keysToCheck.forEach(key => {
            if (
                modalite_livraison[0][key as keyof Modalite_livraisonID] !==
                    null &&
                modalite_livraison[0][key as keyof Modalite_livraisonID] !== ''
            ) {
                setModifiedModalite_livraison(prevState => ({
                    ...prevState,
                    [key]: modalite_livraison[0][
                        key as keyof Modalite_livraisonID
                    ],
                }))
            }
        })
    }

    const Print = () => {
        const printContents = document.getElementById('printablediv')!.innerHTML
        const originalContents = document.body.innerHTML

        const applyPrintStyles = () => {
            document.body.innerHTML = printContents
            document.body.style.margin = '0'
            document.body.style.padding = '0'

            const allElements = document.body.getElementsByTagName('*')
            for (let i = 0; i < allElements.length; i++) {
                const element = allElements[i] as HTMLElement
                element.style.margin = '10px'
                element.style.fontSize = '12px'
                element.style.padding = '0'
                element.style.fontFamily = 'Arial'
                element.style.lineHeight = '1'
                element.style.letterSpacing = '0'
                element.style.wordSpacing = '0'
                element.style.borderLeft = 'none'
            }
        }

        applyPrintStyles()
        window.print()
        document.body.innerHTML = originalContents
        window.location.reload()
    }

    return (
        <div className={style.idPage}>
            <div className={style.croixID}>
                <h1 className={style.titre_global}>Modalités de livraison</h1>
                <a href='javascript:history.go(-1)' className={style.btnC}>
                    <Image
                        className={style.CRid}
                        src='/IMG/return.svg'
                        height={30}
                        width={30}
                        alt='Fermer la fenêtre'
                    />
                </a>
            </div>
            {session &&
                session.user &&
                session.user.role === ('AD' || 'AP' || 'EN' || 'SU') && (
                    <div>
                        <button
                            onClick={() => {
                                if (modify) {
                                    handleSubmit()
                                } else {
                                    setModify(true)
                                    initialValue()
                                }
                            }}
                            className={style.btnModif}
                        >
                            {modify ? 'Envoyer' : 'Modifier'}
                        </button>
                        <button
                            className={style.btnModif}
                            onClick={() => {
                                if (!modify) {
                                    Print()
                                }
                            }}
                            hidden={modify}
                        >
                            Imprimer
                        </button>
                    </div>
                )}

            <div id='printablediv'>
                <div className={style.info_id}>
                    <div className={style.col_1}>
                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Numéro de la livraison :
                                </p>
                                <p>
                                    {modalite_livraison[0].numero_livraison ==
                                    null
                                        ? '/'
                                        : modalite_livraison[0]
                                              .numero_livraison}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>Raison Sociale :</p>
                                <p>
                                    {modalite_livraison[0].raison_sociale_don ==
                                    null
                                        ? '/'
                                        : modalite_livraison[0]
                                              .raison_sociale_don}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Type de livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <SelectComponent
                                        url={`../../../api/dons/${params.donsID}/modalites-livraison/type-livraison`}
                                        onChange={e =>
                                            handleTypeLivraisonChange(e)
                                        }
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .libelle_type_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .libelle_type_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Prestataire transporteur :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <SearchComponent
                                        url={`../../../api/select/prestataire`}
                                        onChange={e =>
                                            handlePrestataireChange(e)
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .code_Prestataire_transporteur ==
                                            null
                                                ? 'Exemple: Entreprise Alpha'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .code_Prestataire_transporteur
                                        }
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .raison_sociale_prestataire == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .raison_sociale_prestataire}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Date prévue de la livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='date'
                                        name='date_prevue_livraison'
                                        value={formatDate(
                                            modifiedModalite_livraison.date_prevue_livraison ||
                                                modalite_livraison[0]
                                                    .date_prevue_livraison,
                                        )}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .date_prevue_livraison == null
                                            ? '/'
                                            : formatDate(
                                                  modalite_livraison[0]
                                                      .date_prevue_livraison,
                                              )}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Heure prévue livraison :
                                </p>

                                <p>
                                    {modalite_livraison[0]
                                        .heure_prevue_livraison == (null || '')
                                        ? '/'
                                        : modalite_livraison[0]
                                              .heure_prevue_livraison}
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Civilite contact enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <SelectComponent
                                        url={`../../../api/select/genre`}
                                        onChange={e =>
                                            handleCiviliteEnlevementChange(e)
                                        }
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .civilite_contact_enlevement == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .civilite_contact_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Nom du contact d&apos;enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='nom_contact_enlevement'
                                        value={
                                            modifiedModalite_livraison.nom_contact_enlevement
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .nom_contact_enlevement ==
                                                null ||
                                            modalite_livraison[0]
                                                .nom_contact_enlevement === ''
                                                ? 'Exemple: Dupont'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .nom_contact_enlevement
                                        }
                                        maxLength={20}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .nom_contact_enlevement == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .nom_contact_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Prénom du contact d&apos;enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='prenom_contact_enlevement'
                                        value={
                                            modifiedModalite_livraison.prenom_contact_enlevement
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .prenom_contact_enlevement ==
                                                null ||
                                            modalite_livraison[0]
                                                .prenom_contact_enlevement ===
                                                ''
                                                ? 'Exemple: Jean'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .prenom_contact_enlevement
                                        }
                                        maxLength={20}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .prenom_contact_enlevement == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .prenom_contact_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Téléphone du contact d&apos;enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='telephone_contact_enlevement'
                                        value={
                                            modifiedModalite_livraison.telephone_contact_enlevement ??
                                            ''
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .telephone_contact_enlevement ==
                                                null ||
                                            modalite_livraison[0]
                                                .telephone_contact_enlevement ===
                                                ''
                                                ? 'Exemple: 0623456789'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .telephone_contact_enlevement
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 12) {
                                                e.target.value =
                                                    e.target.value.slice(0, 12)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .telephone_contact_enlevement ==
                                        null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .telephone_contact_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Mail du contact d&apos;enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='mail'
                                        name='mail_contact_enlevement'
                                        value={
                                            modifiedModalite_livraison.mail_contact_enlevement ??
                                            ''
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .mail_contact_enlevement ==
                                                null ||
                                            modalite_livraison[0]
                                                .mail_contact_enlevement === ''
                                                ? 'Exemple: Jean.dupont@gmail.com'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .mail_contact_enlevement
                                        }
                                        maxLength={255}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .mail_contact_enlevement == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .mail_contact_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Adresse d&apos;enlévement :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='adresse_enlevement'
                                        value={
                                            modifiedModalite_livraison.adresse_enlevement ??
                                            ''
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .adresse_enlevement == null ||
                                            modalite_livraison[0]
                                                .adresse_enlevement === ''
                                                ? 'Exemple: 15 rue de la Paix, 75000 Paris'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .adresse_enlevement
                                        }
                                        maxLength={255}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .adresse_enlevement == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .adresse_enlevement}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Adresse de la livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <SearchComponent
                                        url={`../../../api/select/sites`}
                                        onChange={e => handleAdresseChange(e)}
                                        placeholder={
                                            modalite_livraison[0]
                                                .adresse_livraison == null ||
                                            modalite_livraison[0]
                                                .adresse_livraison === ''
                                                ? 'Exemple: Entrepôt principal'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .adresse_livraison
                                        }
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .adresse_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .adresse_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Civilite contact livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <SelectComponent
                                        url={`../../../api/select/genre`}
                                        onChange={e =>
                                            handleCiviliteLivraisonChange(e)
                                        }
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .civilite_contact_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .civilite_contact_livraison}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={style.col_2}>
                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Nom contact livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='nom_contact_livraison'
                                        value={
                                            modifiedModalite_livraison.nom_contact_livraison
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .nom_contact_livraison ==
                                                null ||
                                            modalite_livraison[0]
                                                .nom_contact_livraison === ''
                                                ? 'Exemple: Petit'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .nom_contact_livraison
                                        }
                                        maxLength={20}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .nom_contact_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .nom_contact_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Prenom contact livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='prenom_contact_livraison'
                                        value={
                                            modifiedModalite_livraison.prenom_contact_livraison
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .prenom_contact_livraison ==
                                                null ||
                                            modalite_livraison[0]
                                                .prenom_contact_livraison === ''
                                                ? 'Exemple: Sophie'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .prenom_contact_livraison
                                        }
                                        maxLength={20}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .prenom_contact_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .prenom_contact_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Téléphone contact livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='telephone_contact_livraison'
                                        value={
                                            modifiedModalite_livraison.telephone_contact_livraison ??
                                            ''
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .telephone_contact_livraison ==
                                                null ||
                                            modalite_livraison[0]
                                                .telephone_contact_livraison ===
                                                ''
                                                ? 'Exemple: 0623451219'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .telephone_contact_livraison
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 12) {
                                                e.target.value =
                                                    e.target.value.slice(0, 12)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .telephone_contact_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .telephone_contact_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Mail contact livraison :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='mail'
                                        name='mail_contact_livraison'
                                        value={
                                            modifiedModalite_livraison.mail_contact_livraison ??
                                            ''
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .mail_contact_livraison ==
                                                null ||
                                            modalite_livraison[0]
                                                .mail_contact_livraison === ''
                                                ? 'Exemple: Sophie.petit@gmail.com'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .mail_contact_livraison
                                        }
                                        maxLength={255}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .mail_contact_livraison == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .mail_contact_livraison}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Nombre de palette(s) prévue(s) :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='nombre_palettes_prevu'
                                        value={
                                            modifiedModalite_livraison.nombre_palettes_prevu
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .nombre_palettes_prevu ==
                                                null ||
                                            modalite_livraison[0]
                                                .nombre_palettes_prevu === null
                                                ? 'Exemple: 15'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .nombre_palettes_prevu
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 20) {
                                                e.target.value =
                                                    e.target.value.slice(0, 20)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .nombre_palettes_prevu ==
                                        (null || '')
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .nombre_palettes_prevu}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Nombre de palette(s) consignée(s) prévue(s)
                                    :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='nombre_palettes_consignees_prevu'
                                        value={
                                            modifiedModalite_livraison.nombre_palettes_consignees_prevu
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .nombre_palettes_consignees_prevu ==
                                                null ||
                                            modalite_livraison[0]
                                                .nombre_palettes_consignees_prevu ===
                                                null
                                                ? 'Exemple: 20'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .nombre_palettes_consignees_prevu
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 20) {
                                                e.target.value =
                                                    e.target.value.slice(0, 20)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .nombre_palettes_consignees_prevu ==
                                        null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .nombre_palettes_consignees_prevu}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Nombre de carton(s) prévu(s) :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='nombre_cartons_prevu'
                                        value={
                                            modifiedModalite_livraison.nombre_cartons_prevu
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .nombre_cartons_prevu == null ||
                                            modalite_livraison[0]
                                                .nombre_cartons_prevu === null
                                                ? 'Exemple: 20'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .nombre_cartons_prevu
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 20) {
                                                e.target.value =
                                                    e.target.value.slice(0, 20)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .nombre_cartons_prevu == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .nombre_cartons_prevu}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Poids prévu en kg :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='poids_prevu_kg'
                                        value={
                                            modifiedModalite_livraison.poids_prevu_kg
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .poids_prevu_kg == null ||
                                            modalite_livraison[0]
                                                .poids_prevu_kg === null
                                                ? 'Exemple: 15'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .poids_prevu_kg
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 20) {
                                                e.target.value =
                                                    e.target.value.slice(0, 20)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0].poids_prevu_kg ==
                                        null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .poids_prevu_kg}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Produit(s) sur palette(s) ? :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.checkboxF}
                                        type='checkbox'
                                        name='produits_sur_palettes'
                                        value={
                                            modifiedModalite_livraison.produits_sur_palettes ||
                                            modalite_livraison[0]
                                                .produits_sur_palettes
                                        }
                                        checked={
                                            modifiedModalite_livraison.produits_sur_palettes
                                                ? modifiedModalite_livraison.produits_sur_palettes ===
                                                  'O'
                                                : modalite_livraison[0]
                                                      .produits_sur_palettes ===
                                                  'O'
                                        }
                                        onChange={handlePalettesChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .produits_sur_palettes == null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .produits_sur_palettes}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>
                                    Température pour la conservation du/des
                                    produit(s) :
                                </p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='number'
                                        name='temperature_conserv_produits'
                                        value={
                                            modifiedModalite_livraison.temperature_conserv_produits
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .temperature_conserv_produits ==
                                                null ||
                                            modalite_livraison[0]
                                                .temperature_conserv_produits ===
                                                null
                                                ? 'Exemple: 28'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .temperature_conserv_produits
                                        }
                                        onInput={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                            if (e.target.value.length > 20) {
                                                e.target.value =
                                                    e.target.value.slice(0, 20)
                                            }
                                        }}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0]
                                            .temperature_conserv_produits ==
                                        null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .temperature_conserv_produits}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className={style.info}>
                                <p className={style.titre}>Commentaires :</p>
                                {modify &&
                                session?.user.role ===
                                    ('AD' || 'AP' || 'EN' || 'SU') ? (
                                    <input
                                        className={style.selectF}
                                        type='input'
                                        name='commentaires'
                                        value={
                                            modifiedModalite_livraison.commentaires
                                        }
                                        placeholder={
                                            modalite_livraison[0]
                                                .commentaires == null ||
                                            modalite_livraison[0]
                                                .commentaires === null
                                                ? 'Exemple: Livraison de produits frais'
                                                : 'Actuellement: ' +
                                                  modalite_livraison[0]
                                                      .commentaires
                                        }
                                        maxLength={200}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>
                                        {modalite_livraison[0].commentaires ==
                                        null
                                            ? '/'
                                            : modalite_livraison[0]
                                                  .commentaires}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={style.info}>
                            <p className={style.titre}>Pièces associées :</p>
                            {modify && session?.user.role === ('AD' || 'RC') ? (
                                <input
                                    className={style.selectF}
                                    type='file'
                                    name='pieces_associees'
                                    onChange={handleFileChange}
                                />
                            ) : modalite_livraison[0].pieces_associees ==
                              null ? (
                                <p>/</p>
                            ) : typeof modalite_livraison[0]
                                  .pieces_associees === 'string' ? (
                                <a
                                    href={
                                        modalite_livraison[0].pieces_associees
                                    }
                                    download='pieces_associees'
                                >
                                    Télécharger la pièce associée
                                </a>
                            ) : (
                                <a
                                    href={
                                        modalite_livraison[0].pieces_associees
                                    }
                                    download='pieces_associees'
                                >
                                    Télécharger la pièce associée
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withAuthorization(Modalites_livraisonPage, [
    'AD',
    'AP',
    'EN',
    'SU',
])
