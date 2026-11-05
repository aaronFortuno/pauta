// Locale order matches the language menu and the columns in the translation table.
const PautaLanguages = {
  ca: 'Català', en: 'English', es: 'Español', de: 'Deutsch', fr: 'Français',
  it: 'Italiano', pt: 'Português', nl: 'Nederlands', eu: 'Euskara', gl: 'Galego',
};

const PautaStrings = Object.fromEntries(`
title|Paper pautat per imprimir|Printable ruled paper|Papel pautado para imprimir|Liniertes Papier zum Ausdrucken|Papier ligné à imprimer|Carta a righe da stampare|Papel pautado para imprimir|Lijntjespapier om te printen|Inprimatzeko paper marraduna|Papel pautado para imprimir
intro|Crea fulls per escriure i practicar cal·ligrafia.|Make sheets for writing and handwriting practice.|Crea hojas para escribir y practicar caligrafía.|Erstelle Blätter zum Schreiben und für Schreibübungen.|Créez des feuilles pour écrire et vous entraîner à l’écriture.|Crea fogli per scrivere e fare esercizi di calligrafia.|Cria folhas para escrever e praticar caligrafia.|Maak bladen om te schrijven en je handschrift te oefenen.|Sortu idazteko eta kaligrafia lantzeko orriak.|Crea follas para escribir e practicar caligrafía.
language|Idioma|Language|Idioma|Sprache|Langue|Lingua|Idioma|Taal|Hizkuntza|Idioma
settings|Ajustos del full|Sheet settings|Ajustes de la hoja|Blatteinstellungen|Réglages de la feuille|Impostazioni del foglio|Definições da folha|Bladinstellingen|Orriaren ezarpenak|Axustes da folla
reset|Restableix els ajustos|Reset settings|Restablecer ajustes|Einstellungen zurücksetzen|Réinitialiser les réglages|Ripristina impostazioni|Repor definições|Instellingen herstellen|Berrezarri ezarpenak|Restablecer axustes
ruling|Pauta|Ruling|Pauta|Lineatur|Réglure|Rigatura|Pauta|Liniëring|Marrak|Pauta
type|Tipus de pauta|Ruling style|Tipo de pauta|Lineaturtyp|Type de réglure|Tipo di rigatura|Tipo de pauta|Soort liniëring|Marra mota|Tipo de pauta
single|Simple|Single|Sencilla|Einfach|Simple|Singola|Simples|Enkel|Bakuna|Sinxela
double|Doble|Double|Doble|Doppelt|Double|Doppia|Dupla|Dubbel|Bikoitza|Dobre
triple|Triple|Triple|Triple|Dreifach|Triple|Tripla|Tripla|Driedubbel|Hirukoitza|Tripla
quad|Quàdruple|Quadruple|Cuádruple|Vierfach|Quadruple|Quadrupla|Quádrupla|Vierdubbel|Laukoitza|Cuádrupla
spacing|Separació entre línies|Line spacing|Separación entre líneas|Linienabstand|Espacement des lignes|Distanza tra le righe|Distância entre linhas|Lijnafstand|Marren arteko tartea|Separación entre liñas
groupSpacing|Separació entre pautes|Space between groups|Separación entre pautas|Abstand zwischen Gruppen|Espace entre groupes|Distanza tra i gruppi|Distância entre pautas|Ruimte tussen groepen|Multzoen arteko tartea|Separación entre pautas
weight|Gruix de les línies|Line thickness|Grosor de las líneas|Linienstärke|Épaisseur des lignes|Spessore delle righe|Espessura das linhas|Lijndikte|Marren lodiera|Grosor das liñas
body|Cos de les lletres|Letter body height|Altura del cuerpo de letra|Buchstabenhöhe|Hauteur du corps des lettres|Altezza del corpo delle lettere|Altura do corpo das letras|Letterromphoogte|Letren gorputzaren altuera|Altura do corpo das letras
upper|Alçada d’ascendents|Ascender height|Altura de ascendentes|Oberlänge|Hauteur des ascendantes|Altezza delle ascendenti|Altura das ascendentes|Hoogte van stokken|Goranzko trazuen altuera|Altura dos ascendentes
lower|Fondària de descendents|Descender depth|Profundidad de descendentes|Unterlänge|Profondeur des descendantes|Profondità delle discendenti|Profundidade das descendentes|Diepte van staarten|Beheranzko trazuen sakonera|Profundidade dos descendentes
margins|Marges|Margins|Márgenes|Ränder|Marges|Margini|Margens|Marges|Marjinak|Marxes
top|Superior|Top|Superior|Oben|Supérieure|Superiore|Superior|Boven|Goikoa|Superior
bottom|Inferior|Bottom|Inferior|Unten|Inférieure|Inferiore|Inferior|Onder|Behekoa|Inferior
left|Esquerre|Left|Izquierdo|Links|Gauche|Sinistro|Esquerda|Links|Ezkerrekoa|Esquerda
right|Dret|Right|Derecho|Rechts|Droite|Destro|Direita|Rechts|Eskuinekoa|Dereita
guides|Línies verticals de marge|Vertical margin lines|Líneas verticales de margen|Senkrechte Randlinien|Lignes verticales de marge|Linee verticali dei margini|Linhas verticais das margens|Verticale margelijnen|Marjina-marra bertikalak|Liñas verticais de marxe
leftGuide|Esquerra|Left|Izquierda|Links|Gauche|Sinistra|Esquerda|Links|Ezkerra|Esquerda
rightGuide|Dreta|Right|Derecha|Rechts|Droite|Destra|Direita|Rechts|Eskuina|Dereita
code|Codi del full|Sheet code|Código de la hoja|Blattcode|Code de la feuille|Codice del foglio|Código da folha|Bladcode|Orriaren kodea|Código da folla
codeHelp|El codi permet recuperar els ajustos d’un full imprès.|Use the code to recover settings from a printed sheet.|El código permite recuperar los ajustes de una hoja impresa.|Mit dem Code lassen sich die Einstellungen eines gedruckten Blatts wiederherstellen.|Le code permet de retrouver les réglages d’une feuille imprimée.|Il codice permette di recuperare le impostazioni di un foglio stampato.|O código permite recuperar as definições de uma folha impressa.|Met de code haal je de instellingen van een geprint blad op.|Kodeak inprimatutako orri baten ezarpenak berreskuratzeko balio du.|O código permite recuperar os axustes dunha folla impresa.
copy|Copia el codi|Copy code|Copiar código|Code kopieren|Copier le code|Copia il codice|Copiar código|Code kopiëren|Kopiatu kodea|Copiar código
printCode|Imprimeix el codi al peu|Print the code at the bottom|Imprimir el código al pie|Code am unteren Rand drucken|Imprimer le code en bas de page|Stampa il codice a piè di pagina|Imprimir o código no rodapé|Code onderaan afdrukken|Inprimatu kodea orri-oinean|Imprimir o código ao pé
restoreLabel|Recupera un full amb el seu codi|Restore a sheet from its code|Recuperar una hoja con su código|Blatt per Code wiederherstellen|Restaurer une feuille avec son code|Recupera un foglio dal suo codice|Recuperar uma folha pelo seu código|Blad herstellen met de code|Berreskuratu orria haren kodearekin|Recuperar unha folla co seu código
restore|Recupera|Restore|Recuperar|Laden|Restaurer|Recupera|Recuperar|Herstellen|Berreskuratu|Recuperar
restored|Ajustos recuperats.|Settings restored.|Ajustes recuperados.|Einstellungen wiederhergestellt.|Réglages restaurés.|Impostazioni recuperate.|Definições recuperadas.|Instellingen hersteld.|Ezarpenak berreskuratu dira.|Axustes recuperados.
invalidCode|Revisa el codi del full.|Check the sheet code.|Revisa el código de la hoja.|Überprüfe den Blattcode.|Vérifiez le code de la feuille.|Controlla il codice del foglio.|Confere o código da folha.|Controleer de bladcode.|Egiaztatu orriaren kodea.|Revisa o código da folla.
copied|Copiat.|Copied.|Copiado.|Kopiert.|Copié.|Copiato.|Copiado.|Gekopieerd.|Kopiatuta.|Copiado.
copyFailed|Selecciona el text i copia’l manualment.|Select the text and copy it manually.|Selecciona el texto y cópialo manualmente.|Markiere den Text und kopiere ihn manuell.|Sélectionnez le texte et copiez-le manuellement.|Seleziona il testo e copialo manualmente.|Seleciona o texto e copia-o manualmente.|Selecteer de tekst en kopieer hem handmatig.|Hautatu testua eta kopiatu eskuz.|Selecciona o texto e cópiao manualmente.
download|Descarrega el PDF|Download PDF|Descargar PDF|PDF herunterladen|Télécharger le PDF|Scarica il PDF|Descarregar PDF|Pdf downloaden|Deskargatu PDFa|Descargar PDF
print|Imprimeix|Print|Imprimir|Drucken|Imprimer|Stampa|Imprimir|Afdrukken|Inprimatu|Imprimir
preview|Previsualització|Preview|Vista previa|Vorschau|Aperçu|Anteprima|Pré-visualização|Voorbeeld|Aurrebista|Vista previa
lineCount|{n} línies|{n} lines|{n} líneas|{n} Linien|{n} lignes|{n} righe|{n} linhas|{n} lijnen|{n} marra|{n} liñas
groupCount|{n} pautes|{n} groups|{n} pautas|{n} Gruppen|{n} groupes|{n} gruppi|{n} pautas|{n} groepen|{n} multzo|{n} pautas
zoomIn|Amplia|Zoom in|Acercar|Vergrößern|Agrandir|Ingrandisci|Ampliar|Inzoomen|Handitu|Achegar
zoomOut|Redueix|Zoom out|Alejar|Verkleinern|Réduire|Riduci|Reduzir|Uitzoomen|Txikitu|Afastar
zoomFit|Ajusta el full a la vista|Fit sheet to view|Ajustar hoja a la vista|Blatt an Ansicht anpassen|Ajuster la feuille à la vue|Adatta il foglio alla vista|Ajustar a folha à vista|Blad passend maken|Doitu orria ikuspegira|Axustar a folla á vista
sheet|Full A4 amb les línies pautades|A4 ruled sheet|Hoja A4 con líneas pautadas|Liniertes A4-Blatt|Feuille A4 lignée|Foglio A4 a righe|Folha A4 pautada|Gelijnd A4-blad|A4 orri marraduna|Folla A4 pautada
format|A4 vertical|A4 portrait|A4 vertical|A4 Hochformat|A4 portrait|A4 verticale|A4 vertical|A4 staand|A4 bertikala|A4 vertical
project|Projecte|Project|Proyecto|Projekt|Projet|Progetto|Projeto|Project|Proiektua|Proxecto
changelog|Canvis|Changelog|Cambios|Änderungen|Nouveautés|Novità|Alterações|Wijzigingen|Aldaketak|Cambios
license|Llicència|License|Licencia|Lizenz|Licence|Licenza|Licença|Licentie|Lizentzia|Licenza
repo|Repositori|Repository|Repositorio|Repository|Dépôt|Repository|Repositório|Repository|Biltegia|Repositorio
close|Tanca|Close|Cerrar|Schließen|Fermer|Chiudi|Fechar|Sluiten|Itxi|Pechar
release|Pauta simple i de cal·ligrafia, marges configurables i codi curt per recuperar un full. Previsualització amb zoom i exportació en PDF.|Single and handwriting rulings, adjustable margins and a short code to restore a sheet. Zoomable preview and PDF export.|Pauta sencilla y de caligrafía, márgenes ajustables y código corto para recuperar una hoja. Vista previa con zoom y exportación a PDF.|Einfache und Schreiblernlineaturen, einstellbare Ränder und Kurzcode zum Wiederherstellen. Zoombare Vorschau und PDF-Export.|Réglures simples et d’écriture, marges réglables et code court pour retrouver une feuille. Aperçu avec zoom et export PDF.|Rigatura semplice e per calligrafia, margini regolabili e codice breve per recuperare un foglio. Anteprima con zoom ed esportazione PDF.|Pautas simples e de caligrafia, margens ajustáveis e código curto para recuperar uma folha. Pré-visualização com zoom e exportação PDF.|Enkele en schrijfliniëring, instelbare marges en een korte herstelcode. Voorbeeld met zoom en pdf-export.|Marra bakunak eta kaligrafiakoak, marjina doigarriak eta orria berreskuratzeko kode laburra. Zoomdun aurrebista eta PDF esportazioa.|Pauta sinxela e de caligrafía, marxes axustables e código curto para recuperar unha folla. Vista previa con zoom e exportación a PDF.
openSource|Pauta és programari lliure amb llicència GNU GPL-3.0.|Pauta is free software under the GNU GPL-3.0 license.|Pauta es software libre con licencia GNU GPL-3.0.|Pauta ist freie Software unter der GNU GPL-3.0.|Pauta est un logiciel libre sous licence GNU GPL-3.0.|Pauta è software libero con licenza GNU GPL-3.0.|Pauta é software livre com licença GNU GPL-3.0.|Pauta is vrije software onder de GNU GPL-3.0-licentie.|Pauta GNU GPL-3.0 lizentziako software librea da.|Pauta é software libre con licenza GNU GPL-3.0.
v4v|Si Pauta et resulta útil, pots donar-hi suport amb un microdonatiu voluntari per Lightning. Compartir-la o proposar millores també ajuda.|If Pauta helps you, you can support it with a voluntary microdonation over Lightning. Sharing it or suggesting improvements helps too.|Si Pauta te resulta útil, puedes apoyarla con una microdonación voluntaria por Lightning. Compartirla o proponer mejoras también ayuda.|Wenn dir Pauta hilft, kannst du das Projekt mit einer freiwilligen Mikrospende über Lightning unterstützen. Teilen und Verbesserungsvorschläge helfen auch.|Si Pauta vous est utile, vous pouvez soutenir le projet par un microdon volontaire via Lightning. Le partager ou proposer des améliorations aide aussi.|Se Pauta ti è utile, puoi sostenerla con una microdonazione volontaria via Lightning. Anche condividerla o suggerire migliorie è d’aiuto.|Se o Pauta te for útil, podes apoiá-lo com um microdonativo voluntário por Lightning. Partilhá-lo ou sugerir melhorias também ajuda.|Als Pauta je helpt, kun je het steunen met een vrijwillige microdonatie via Lightning. Delen of verbeteringen voorstellen helpt ook.|Pauta baliagarria bazaizu, Lightning bidezko borondatezko dohaintza txiki batekin lagun dezakezu. Partekatzeak edo hobekuntzak proposatzeak ere laguntzen du.|Se Pauta che resulta útil, podes apoiala cunha microdoazón voluntaria por Lightning. Compartila ou propoñer melloras tamén axuda.
openLightning|Obre la cartera Lightning|Open Lightning wallet|Abrir cartera Lightning|Lightning-Wallet öffnen|Ouvrir le portefeuille Lightning|Apri il portafoglio Lightning|Abrir carteira Lightning|Lightning-wallet openen|Ireki Lightning zorroa|Abrir carteira Lightning
copyLightning|Copia l’adreça Lightning|Copy Lightning address|Copiar dirección Lightning|Lightning-Adresse kopieren|Copier l’adresse Lightning|Copia l’indirizzo Lightning|Copiar endereço Lightning|Lightning-adres kopiëren|Kopiatu Lightning helbidea|Copiar o enderezo Lightning
`.trim().split('\n').map(line => {
  const [key, ...translations] = line.split('|');
  return [key, translations];
}));
