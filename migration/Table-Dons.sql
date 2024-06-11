CREATE TABLE Dons (
    code_Don INT PRIMARY KEY,
    code_Entite_donatrice INT,
    date_proposition_don DATE NOT NULL,
    code_contact_Entite_donatrice INT,
    code_type_don CHAR(4) NOT NULL,
    code_type_competences CHAR(4),
    code_type_produits CHAR(4),
    code_mode_conservation_produits CHAR(4),
    date_debut_mise_disposition DATE,
    date_fin_mise_disposition DATE,
    commentaires VARCHAR(200),
    pieces_associees BLOB,
    code_Utilisateur_saisie_don INT NOT NULL,
    statut_acceptation_don ENUM('Valide', 'Refuse'),
    date_acceptation_refus_don DATE,
    type_date_acceptation_refus ENUM('A', 'R'),
    code_Utilisateur_accepte_refuse_don INT,
    code_site_beneficiaire_don INT,
    FOREIGN KEY (code_Entite_donatrice) REFERENCES Entite(code_Entite),
    FOREIGN KEY (code_contact_Entite_donatrice) REFERENCES ContactEntite(code_contact_entite),
    FOREIGN KEY (code_type_don) REFERENCES TypeDons(code_type_don),
    FOREIGN KEY (code_type_competences) REFERENCES TypeCompetences(code_type_competences),
    FOREIGN KEY (code_type_produits) REFERENCES TypeProduits(code_type_produits),
    FOREIGN KEY (code_mode_conservation_produits) REFERENCES ModeConservationProduits(code_mode_conservation_produits),
    FOREIGN KEY (code_Utilisateur_saisie_don) REFERENCES Utilisateur(code_utilisateur),
    FOREIGN KEY (code_Utilisateur_accepte_refuse_don) REFERENCES Utilisateur(code_utilisateur),
    FOREIGN KEY (code_site_beneficiaire_don) REFERENCES Site(code_site)
);
