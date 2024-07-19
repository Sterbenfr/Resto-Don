'use client'
import { useEffect, useState } from 'react'
import style from '../../../styles/components.module.css'
import Image from 'next/image'

interface PrestataireID {
    code_Prestataire: number
    TP_libelle: string
    raison_sociale: string
    nom_commercial: string
    Siren: string
    Siret: string
    telephone: string
    mail: string
    adresse: string
    civilite_contact_prestataire: string
    nom_contact_prestataire: string
    prenom_contact_prestataire: string
    telephone_contact_prestataire: string
    mail_contact_prestataire: string
    commentaires: string
    date_arret_activite_du_prestataire: Date
}

export default function PrestatairePage({
    params,
}: {
    params: { prestataireID: string }
}) {
    const [prestataire, setPrestataire] = useState<PrestataireID[]>([])

    useEffect(() => {
        const fetchPrestataire = async () => {
            if (!params.prestataireID) return

            const res = await fetch(
                `../../api/prestataire/${params.prestataireID}`,
            )

            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }

            const prestataire: PrestataireID[] = await res.json()
            setPrestataire(prestataire)
        }

        fetchPrestataire()
    }, [params.prestataireID])
    if (!prestataire || prestataire.length === 0)
        return (
            <div className={style.page}>
                <h2 className={style.load}>Chargement...</h2>
            </div>
        )

    return (
        <div className={style.idPage}>
            <div className={style.croixID}>
                <h1 className={style.titre_global}>Détails du prestataire</h1>
                <a href='/prestataire' className={style.btnC}>
                    <Image
                        className={style.CRid}
                        src='/IMG/Return.png'
                        height={30}
                        width={30}
                        alt='Fermer la fenêtre'
                    />
                </a>
            </div>

            <div className={style.info_id}>
                <div className={style.col_1}>
                    <div className={style.info}>
                        <p className={style.titre}>Code du prestataire :</p>
                        <p>
                            {prestataire[0].code_Prestataire == null
                                ? '/'
                                : prestataire[0].code_Prestataire}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Type du prestataire :</p>
                        <p>
                            {prestataire[0].TP_libelle === null || ''
                                ? '/'
                                : prestataire[0].TP_libelle}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Raison sociale :</p>
                        <p>
                            {prestataire[0].raison_sociale === null || ''
                                ? '/'
                                : prestataire[0].raison_sociale}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Nom commercial :</p>
                        <p>
                            {prestataire[0].nom_commercial === (null || '')
                                ? '/'
                                : prestataire[0].nom_commercial}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Siren :</p>
                        <p>
                            {prestataire[0].Siren === (null || '') || ''
                                ? '/'
                                : prestataire[0].Siren}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Siret :</p>
                        <p>
                            {prestataire[0].Siret == (null || '')
                                ? '/'
                                : prestataire[0].Siret}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Téléphone :</p>
                        <p>
                            {prestataire[0].telephone == (null || '')
                                ? '/'
                                : prestataire[0].telephone}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Mail :</p>
                        <p>
                            {prestataire[0].mail == (null || '')
                                ? '/'
                                : prestataire[0].mail}
                        </p>
                    </div>
                </div>

                <div className={style.col_2}>
                    <div className={style.info}>
                        <p className={style.titre}>Adresse :</p>
                        <p>
                            {prestataire[0].adresse == (null || '')
                                ? '/'
                                : prestataire[0].adresse}
                        </p>
                    </div>
                    <div className={style.info}>
                        <p className={style.titre}>
                            Civilité du contact du prestataire :
                        </p>
                        <p>
                            {prestataire[0].civilite_contact_prestataire ==
                            (null || '')
                                ? '/'
                                : prestataire[0]
                                        .civilite_contact_prestataire === 'M.'
                                  ? 'Monsieur'
                                  : prestataire[0]
                                          .civilite_contact_prestataire ===
                                      'Mme'
                                    ? 'Madame'
                                    : 'Autre'}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>
                            Nom du contact du prestataire :
                        </p>
                        <p>
                            {prestataire[0].nom_contact_prestataire ==
                            (null || '')
                                ? '/'
                                : prestataire[0].nom_contact_prestataire}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>
                            Prénom du contact du prestataire :
                        </p>
                        <p>
                            {prestataire[0].prenom_contact_prestataire ==
                            (null || '')
                                ? '/'
                                : prestataire[0].prenom_contact_prestataire}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>
                            Téléphone du contact du prestataire :
                        </p>
                        <p>
                            {prestataire[0].telephone_contact_prestataire ==
                            (null || '')
                                ? '/'
                                : prestataire[0].telephone_contact_prestataire}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>
                            Mail du contact du prestataire :
                        </p>
                        <p>
                            {prestataire[0].mail_contact_prestataire ==
                            (null || '')
                                ? '/'
                                : prestataire[0].mail_contact_prestataire}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>Commentaires :</p>
                        <p>
                            {prestataire[0].commentaires == (null || '')
                                ? '/'
                                : prestataire[0].commentaires}
                        </p>
                    </div>

                    <div className={style.info}>
                        <p className={style.titre}>
                            Date d&apos;arrêt de l&apos;activité du prestataire
                            :
                        </p>
                        <p>
                            {prestataire[0]
                                .date_arret_activite_du_prestataire == null
                                ? '/'
                                : prestataire[0].date_arret_activite_du_prestataire
                                      .toString()
                                      .split('T')[0]}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
