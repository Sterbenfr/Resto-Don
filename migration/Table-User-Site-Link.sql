CREATE TABLE SitesRattachement (
    code_utilisateur INT(6) NOT NULL,
    code_site INT(5) NOT NULL,
    code_type_utilisateur CHAR(4) NOT NULL,
    date_fin_activite DATE,
    PRIMARY KEY (code_utilisateur, code_site),
    FOREIGN KEY (code_utilisateur) REFERENCES Utilisateurs(code_utilisateur),
    FOREIGN KEY (code_site) REFERENCES Sites(code_site),
    FOREIGN KEY (code_type_utilisateur) REFERENCES TypesUtilisateurs(code_type_utilisateur)
);
INSERT INTO SitesRattachement (
    code_utilisateur,
    code_site,
    code_type_utilisateur,
    date_fin_activite
) VALUES 
(101, 1, 'TU001', NULL),
(102, 2, 'TU002', NULL),
(103, 3, 'TU003', NULL),
(104, 4, 'TU004', NULL),
(105, 5, 'TU005', NULL);
