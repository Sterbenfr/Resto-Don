import React, { useEffect, useState } from 'react'
import SelectComponent from './select-component'
import SearchComponent from './searchComponent'
import FileUpload from './uploadComponent'
import Image from 'next/image'
import style from '../styles/components.module.css'

const fieldLabels: { [key: string]: string } = {
    //Dons
    code_Entite_donatrice: 'Entité donatrice',
    titre_don: 'Titre du don',
    date_proposition_don: 'Date de proposition du don',
    code_contact_Entite_donatrice: "Contact de l'entité donatrice",
    code_type_don: 'Type de dons',
    code_type_competences: 'Type de compétences',
    code_type_produits: 'Type de produits',
    code_mode_conservation_produits: 'Mode de conservation des produits',
    date_debut_mise_disposition: 'Date de début de mise à disposition',
    date_fin_mise_disposition: 'Date de fin de mise à disposition',
    commentaires: 'Commentaires',
    pieces_associees: 'Pièces associées',
    code_Utilisateur_saisie_don: 'Utilisateur de la saisie du don',
    statut_acceptation_don: 'Statut du don',
    date_acceptation_refus_don: "Date d'acceptation ou de refus du don",
    code_Utilisateur_accepte_refuse_don: 'Validateur du don',
    code_site_beneficiaire_don: 'Site bénéficiaire du don',
    indicateur_remerciement: 'Indicateur du remerciement',
    date_remerciement: 'Date de remerciement du don',
    nom_destinataire_cerfa: 'Nom du destinataire cerfa',
    adresse_destinataire_cerfa: 'Adresse du destinataire cerfa',
    adresse_mail_destinataire_cerfa: 'Adresse mail du destinataire cerfa',
    telephone_destinataire_cerfa: 'Téléphone du destinataire cerfa',
    valeur_cerfa: 'Valeur du cerfa',
    cerfa_fait: 'Cerfa fait',
    date_cerfa: 'Date du cerfa',
    cerfa: 'Cerfa',
    //Modaliteés Livraison
    numero_livraison: 'Numéro de réception',
    code_Don: 'Don',
    code_type_livraison: 'Type de livraison',
    date_prevue_livraison: 'Date de livraison prévue',
    heure_prevue_livraison: 'Heure de livraison prévue',
    adresse_enlevement: "Adresse d'enlèvement",
    civilite_contact_enlevement: "Civilité du contact d'enlèvement",
    nom_contact_enlevement: "Nom du contact d'enlèvement",
    prenom_contact_enlevement: "Prénom du contact d'enlèvement",
    telephone_contact_enlevement: "Téléphone du contact d'enlèvement",
    mail_contact_enlevement: "Mail du contact d'enlèvement",
    code_Prestataire_transporteur: 'Prestataire transporteur',
    adresse_livraison: 'Adresse de livraison',
    civilite_contact_livraison: 'Civilité du contact de livraison',
    nom_contact_livraison: 'Nom du contact de livraison',
    prenom_contact_livraison: 'Prénom du contact de livraison',
    telephone_contact_livraison: 'Téléphone du contact de livraison',
    mail_contact_livraison: 'Mail du contact de livraison',
    nombre_palettes_prevu: 'Nombre de palettes prévues',
    nombre_palettes_consignees_prevu: 'Nombre de palettes consignées prévues',
    nombre_cartons_prevu: 'Nombre de cartons prévus',
    poids_prevu_kg: 'Poids prévu en kg',
    produits_sur_palettes: 'Produits sur palettes',
    temperature_conserv_produits: 'Température de conservation des produits',
    //Reception
    numero_reception: 'Numéro de réception',
    numero_livraion: 'Numéro de livraison',
    date_reception: 'Date de réception',
    heure_reception: 'Heure de réception',
    nombre_palettes_recues: 'Nombre de palettes reçues',
    nombre_palettes_consignees_recues: 'Nombre de palettes consignées reçues',
    nombre_palettes_consignees_rendues: 'Nombre de palettes consignées rendues',
    nombre_cartons_recus: 'Nombre de cartons reçus',
    poids_recu_kg: 'Poids reçu en kg',
    //Prestataires
    code_Prestataire: 'Prestataire',
    code_type_de_Prestataire: 'Type de prestataire',
    raison_sociale: 'Raison sociale',
    nom_commercial: 'Nom commercial',
    Siren: 'Siren',
    Siret: 'Siret',
    telephone: 'Téléphone',
    mail: 'Mail',
    adresse: 'Adresse',
    civilite_contact_prestataire: 'Civilité du prestataire',
    nom_contact_prestataire: 'Nom du prestataire',
    prenom_contact_prestataire: 'Prénom du prestataire',
    telephone_contact_prestataire: 'Téléphone du prestataire',
    mail_contact_prestataire: 'Mail du prestataire',
    date_arret_activite_du_prestataire:
        "Date d'arrêt d'activité du prestataire",
    //Interactions
    code_Utilisateur_Prospecteur: 'Utilisateur prospecteur',
    code_Entite_Prospectee: 'Entité prospectée',
    date_interaction: "Date d'interaction",
    code_type_interaction: "Type d'interaction",
    code_modalite_interaction: "Modalité d'interaction",
    code_contact_entite: "Contact de l'entité",
    date_relance: 'Date de relance',
    //Sites
    code_Site: 'Site',
    designation_longue: 'Désignation longue',
    designation_courte: 'Désignation courte',
    code_type_site: 'Type de site',
    date_ouverture: "Date d'ouverture",
    date_fermeture: 'Date de fermeture',
    numero_telephone: 'Numéro de téléphone',
    adresse_mail: 'Adresse mail',
    //SitesRattachement
    code_interlocuteur: 'Utilisateur',
    code_site: 'Site',
    code_type_utilisateur: "Type d'utilisateur",
    date_fin_activite: "Date de fin d'activité",
    //Utilisateurs
    civilite: 'Civilité',
    nom: 'Nom',
    prenom: 'Prénom',
    tel_perso: 'Téléphone personnel',
    password: 'Mot de passe',
    //Interlocuteur
    code_type_interlocuteur: "Type d'interlocuteur",
    //Societe
    code_Societe: 'Société',
    Logo: 'Logo',
    site_Web: 'Site Web',
    code_type_activite_Societe: "Type d'activité de l'entreprise",
    code_Groupe_appartenance: 'Appartenance du groupe',
    date_arret_activite_Societe: "Date d'arrêt d'activité de l'entreprise'",
    //SuiviSociete
    code_type_de_Site: 'Type de site',
    code_site_suivi: 'Site assurant suivi',
    code_utilisateur_suivant: 'Utilisateur suivant',
    //Groupe
    code_groupe: 'Groupe',
    nom_du_Groupe: 'Nom du groupe',
    date_arret_activite_du_Groupe: "Date d'arrêt d'activité du groupe",
    //SuiviGroupe
    //Entité
    code_entite: 'Entité',
    logo: 'Logo',
    siret: 'Siret',
    code_ape: 'APE',
    code_ape_naf: 'APE NAF',
    code_rna: 'RNA',
    code_cee: 'CEE',
    code_societe_appartenance: 'Appartenance de la société',
    site_internet: 'Site internet',
    code_type_entite: "Type d'entité",
    code_type_produit: 'Type de produit',
    code_type_competence: 'Type de compétence',
    commentaires_logistique: 'Commentaires de logistique',
    presence_quai: "Présence d'un quai",
    code_frequence_cerfa: 'Fréquence de cerfa',
    date_arret_activite: "Date d'arrêt d'activité de l'entité",
    //ContactEntite
    //Contacts
    code_contact: 'Contact',
    photo: 'Photo',
    fonction: 'Fonction',
    service: 'Service',
    numero_fixe: 'Numéro de téléphone fixe',
    numero_portable: 'Numéro de téléphone portable',
    date_arret_contact: 'Date arrêt contact',
    //type
    code: 'Code',
    libelle: 'Libellé',
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

type Field = {
    id: string
    type:
        | 'input'
        | 'checkbox'
        | 'number'
        | 'date'
        | 'file'
        | 'select'
        | 'enum'
        | 'search'
        | 'password'
    value: string | boolean | null
    placeholder?: string
    createURL?: string
    url?: string
    required?: boolean
    disabled?: boolean
    maxLength?: number
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
    onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface PopUpProps {
    onClose: () => void
    fields: Field[]
    url: string
    onFieldChange?: (id: string, value: string | boolean) => void 
    fileUrl?: string
    fileUrl2?: string
    fileIndex?: number
    fileIndex2?: number
}

const PopUp: React.FC<PopUpProps> = ({
    onClose,
    fields,
    url,
    onFieldChange,
    fileUrl,
    fileUrl2,
    fileIndex,
    fileIndex2,
}) => {
    const [inputs, setInputs] = useState<Field[]>(fields)
    const [file, setFile] = useState<File | null>(null)
    const [file2, setFile2] = useState<File | null>(null)
    let colIndex = 0 
    let rowIndex = 0 

    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string
    }>({})

    useEffect(() => {
        setInputs(fields)
    }, [fields])

    const handleInputChange = (id: string, value: string | boolean) => {
        const updatedInputs = inputs.map(input =>
            input.id === id ? { ...input, value } : input,
        )
        setInputs(updatedInputs)

        if (onFieldChange) {
            onFieldChange(id, value)
        }
    }

    const validateInputs = () => {
        const errors: { [key: string]: string } = {}
        inputs.forEach(input => {
            if (input.required && !input.value) {
                errors[input.id] = `${fieldLabels[input.id]} obligatoire`
            }
        })
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const renderRequiredIndicator = (input: Field) => {
        if (input.required) {
            return <span className={style.requis}>&nbsp;*&nbsp;</span>
        }
        return null
    }

    const handleAction = async () => {
        setInputs(fields)
        const isAnyRequiredInputEmpty = inputs.some(
            input => input.required && !fieldLabels[input.id],
        )

        if (isAnyRequiredInputEmpty) {
            scrollToTop()
            return
        }
        if (validateInputs()) {
            const endpoint = url
            let filePath
            let file2Path
            if (fileUrl && fileIndex && file !== null) {
                const formData = new FormData()
                formData.append('image', file as Blob)
                try {
                    const response = await fetch(fileUrl, {
                        method: 'POST',
                        body: formData,
                    })
                    if (!response.ok) {
                        throw new Error('File upload failed')
                    }
                    const data = await response.json()
                    filePath = data.filePath
                } catch (error) {
                    console.error('Error uploading file:', error)
                }
            }

            if (fileUrl2 && fileIndex2 && file2 !== null) {
                const formData = new FormData()
                formData.append('image', file2 as Blob)
                try {
                    const response = await fetch(fileUrl2, {
                        method: 'POST',
                        body: formData,
                    })
                    if (!response.ok) {
                        throw new Error('File upload failed')
                    }
                    const data = await response.json()
                    file2Path = data.filePath
                } catch (error) {
                    console.error('Error uploading file:', error)
                }
            }

            fileIndex ? (inputs[fileIndex].value = filePath) : null
            fileIndex2 ? (inputs[fileIndex2].value = file2Path) : null
            const inputsData = inputs.reduce<{
                [key: string]: string | boolean | null
            }>((acc, input) => {
                acc[input.id] = input.value
                return acc
            }, {})

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputsData),
                })

                if (response.ok) {
                    onClose()
                } else {
                    console.error('Submission failed', await response.text())
                }
            } catch (error) {
                console.error('Network error:', error)
            }
            onClose()

            window.location.reload()
        } else {
            scrollToTop()
        }
    }

    const [popupTitle, setPopupTitle] = useState('')

    const getTableNameFromFieldId = (fieldId: string): string => {
        const tableNameMapping: { [key: string]: string } = {
            numero_portable: 'un contact',
            Logo: 'une entreprise',
            adresse: 'une entité',
            numero_telephone: 'un site',
            mail: 'un prestataire',
            date_arret_activite_du_Groupe: 'un groupe',
            code_type_don: 'un don',
            nombre_palettes_recues: 'une réception',
            adresse_enlevement: 'une livraison',
            code_modalite_interaction: 'une interaction',
            code_type_interlocuteur: 'un interlocuteur site RC',
            password: 'un utilisateur',
        }
        return tableNameMapping[fieldId] || 'un type'
    }

    useEffect(() => {
        if (fields.length > 0) {
            const firstFieldId = fields[4]?.id || fields[0]?.id
            const tableName = getTableNameFromFieldId(firstFieldId)
            setPopupTitle(`Ajouter ${tableName}`)
        }
    }, [fields])

    return (
        <div className={'popup-container'}>
            <div className={style.page1}>
                <div className={style.croix}>
                    <h2 className={style.lg1}>{popupTitle}</h2>
                    <button
                        className={style.btnC}
                        onClick={() => {
                            onClose()
                            window.location.reload()
                        }}
                    >
                        <Image
                            className={style.CR}
                            src='/IMG/close.svg'
                            height={30}
                            width={30}
                            alt='Fermer la fenêtre'
                        />
                    </button>
                </div>
            </div>
            <div
                className={
                    fields.some(field =>
                        field.id.startsWith('date_debut_mise_disposition'),
                    )
                        ? style.gridTwoColumns
                        : ''
                }
            >
                {inputs.map(
                    input => (
                        (colIndex =
                            input.id === 'code_Entite_donatrice' &&
                            colIndex === 0
                                ? 0
                                : input.id === 'code_Utilisateur_saisie_don' &&
                                    colIndex === 0
                                  ? 1
                                  : input.id === 'nom_destinataire_cerfa' &&
                                      colIndex === 1
                                    ? 2
                                    : colIndex), 
                        (rowIndex =
                            input.id === 'code_Entite_donatrice' ||
                            input.id === 'code_Utilisateur_saisie_don' ||
                            input.id === 'nom_destinataire_cerfa'
                                ? 0
                                : rowIndex + 1), 
                        (
                            <div
                                className={style.popupCol} 
                                key={input.id}
                                data-col={colIndex} 
                                data-row={rowIndex} 
                            >
                                <div className={style.rowPop} key={input.id}>
                                    <label className={style.label}>
                                        {fieldLabels[input.id]}
                                        {renderRequiredIndicator(input)}
                                    </label>
                                    {(() => {
                                        switch (input.type) {
                                            case 'select':
                                                return (
                                                    <SelectComponent
                                                        key={input.id}
                                                        createURL={
                                                            input.createURL as string
                                                        }
                                                        url={
                                                            input.url as string
                                                        }
                                                        required={
                                                            input.required
                                                        }
                                                        onChange={
                                                            input.onChange
                                                        }
                                                    />
                                                )
                                            case 'search':
                                                return (
                                                    <SearchComponent
                                                        key={input.id}
                                                        url={
                                                            input.url as string
                                                        }
                                                        createURL={
                                                            input.createURL as string
                                                        }
                                                        required={
                                                            input.required
                                                        }
                                                        placeholder={
                                                            input.placeholder
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                input.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        onInputChange={
                                                            input.onInputChange
                                                        }
                                                    />
                                                )
                                            case 'checkbox':
                                                return (
                                                    <input
                                                        key={input.id}
                                                        type='checkbox'
                                                        required={
                                                            input.required
                                                        }
                                                        className={
                                                            style.checkboxF
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                input.id,
                                                                e.target
                                                                    .checked,
                                                            )
                                                        }
                                                        onInput={
                                                            input.onInputChange
                                                        }
                                                    />
                                                )
                                            case 'file':
                                                return (
                                                    <FileUpload
                                                        setFile={
                                                            input.id ===
                                                            'pieces_associees'
                                                                ? setFile
                                                                : setFile2
                                                        }
                                                    />
                                                )

                                            case 'number':
                                                return (
                                                    <input
                                                        key={input.id}
                                                        type='number'
                                                        required={
                                                            input.required
                                                        }
                                                        placeholder={
                                                            input.placeholder
                                                        }
                                                        className={
                                                            style.selectF
                                                        }
                                                        value={
                                                            input.value === null
                                                                ? ''
                                                                : (input.value as string)
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                input.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        onInput={(
                                                            e: React.ChangeEvent<HTMLInputElement>,
                                                        ) => {
                                                            if (
                                                                input.maxLength &&
                                                                e.target.value
                                                                    .length >
                                                                    input.maxLength
                                                            ) {
                                                                e.target.value =
                                                                    e.target.value.slice(
                                                                        0,
                                                                        input.maxLength,
                                                                    )
                                                            }
                                                            input.onInputChange &&
                                                                input.onInputChange(
                                                                    e,
                                                                )
                                                        }}
                                                    />
                                                )
                                            default:
                                                return (
                                                    <input
                                                        key={input.id}
                                                        type={input.type}
                                                        placeholder={
                                                            input.placeholder
                                                        }
                                                        required={
                                                            input.required
                                                        }
                                                        className={
                                                            style.selectF
                                                        }
                                                        value={
                                                            input.value === null
                                                                ? ''
                                                                : (input.value as string)
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                input.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        onInput={
                                                            input.onInputChange
                                                        }
                                                        disabled={
                                                            input.disabled
                                                        }
                                                        maxLength={
                                                            input.maxLength
                                                        }
                                                    />
                                                )
                                        }
                                    })()}
                                    {validationErrors[input.id] && (
                                        <p className={style.error}>
                                            {validationErrors[input.id]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    ),
                )}
            </div>
            <div className={style.container}>
                <button className={style.savebutton} onClick={handleAction}>
                    Enregistrer
                </button>
            </div>
        </div>
    )
}

export default PopUp
