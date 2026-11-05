# Pauta.

Generador de paper pautat A4 i A5 per escriure i practicar cal·ligrafia. Obre `dist/index.html` al navegador. La pàgina funciona sense instal·lar dependències i genera el PDF al dispositiu.

- Pauta simple, doble, triple o quàdruple. Les pautes de cal·ligrafia tenen controls per al cos de les lletres i, quan correspon, per als ascendents i descendents.
- Plantilles de pauta ampla i estreta, doble per a cicle mitjà i quàdruple per a infantil i cicle inicial. Es poden aplicar amb qualsevol mida i orientació.
- Paper A4 o A5 en vertical o horitzontal, amb línies contínues o discontínues i color configurable.
- Marges independents i guies verticals opcionals als dos costats.
- Codi `P2` opcional al peu. Introdueix-lo al quadre **Codi del full** per recuperar la configuració del paper. També s’accepten els codis `P1`.
- Pauta simple amb 12 mm de separació inicial.
- Gira la roda del ratolí sobre la previsualització per fer zoom i arrossega el full per moure’l. Imprimeix al 100 % per conservar les mesures del PDF.

El web és a [pauta.ortogra.fi](https://pauta.ortogra.fi/). GitHub Pages publica `dist/` amb el flux de GitHub Actions quan canvia el web a `main`. L’avís de Pentagrama es mostra un segon després de carregar la pàgina i s’amaga al cap de dotze segons. El temporitzador es pausa quan el punter o el focus són dins l’avís.

Projecte amb llicència [GNU GPL-3.0](LICENSE). Les [icones Lucide](https://lucide.dev/) es distribueixen sota les seves [llicències ISC i MIT](dist/lucide-LICENSE.txt).
