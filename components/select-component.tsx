import React, { useEffect, useState } from 'react'
import style from '../styles/components.module.css'

interface SelectComponentProps {
    url: string
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

interface Option {
    value: string
    label: string
    params1: string
    params2: string
    params3: string
}

export default function SelectComponent({
    url,
    onChange,
}: SelectComponentProps) {
    const [options, setOptions] = useState<Option[]>([])

    const fetchOptions = async () => {
        try {
            const response = await fetch(url)
            const data = await response.json()
            const formattedOptions = data.map(
                (item: {
                    id: string
                    label: string
                    params1: string
                    params2: string
                    params3: string
                }) => ({
                    value: item.id,
                    label: item.label,
                    params1: item.params1,
                    params2: item.params2,
                    params3: item.params3,
                }),
            )
            setOptions(formattedOptions)
        } catch (error) {
            console.error('Erreur lors de la récupération des données', error)
        }
    }

    useEffect(() => {
        fetchOptions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url])

    // Renvoyer le menu déroulant avec les options
    return (
        <select className={style.selectF} onChange={onChange}>
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                    {option.params1 !== undefined && <> - {option.params1}</>}
                    {option.params2 !== undefined && <> - {option.params2}</>}
                    {option.params3 !== undefined && <> - {option.params3}</>}
                </option>
            ))}
        </select>
    )
}
