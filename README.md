# Pauta.

Generador de paper pautat A4 i A5 per escriure i practicar cal·ligrafia. Obre `dist/index.html` al navegador. La pàgina funciona sense instal·lar dependències i genera el PDF al dispositiu.

- Pauta simple, doble, triple o quàdruple. Les pautes de cal·ligrafia tenen controls per al cos de les lletres i, quan correspon, per als ascendents i descendents.
- Plantilles de pauta ampla (19 mm) i estreta (11 mm), doble per a cicle mitjà i quàdruple per a infantil i cicle inicial. Es poden aplicar amb qualsevol mida i orientació.
- Al menú **Plantilles**, desa el full actual amb un nom i amaga o recupera les plantilles inicials. Les plantilles pròpies i les preferències de galeria es desen al navegador. Pots descarregar les plantilles pròpies en JSON i importar-les al mateix navegador o en un altre. La importació afegeix les plantilles noves i omet les coincidències exactes.
- Paper A4 o A5 en vertical o horitzontal, amb línies contínues o discontínues i color configurable.
- Marges independents i guies verticals opcionals als dos costats.
- Codi de recuperació activat al peu per defecte. Al menú **Codi del full**, pots copiar-lo, desactivar-lo o enganxar el codi o la línia sencera per recuperar la configuració. També s’accepten els codis `P1`.
- Pauta inicial `P2-VYTS-Z0W3-TBTM-Y`, amb línies simples cada 16 mm, traç de 0,8 mm i guies laterals. La primera línia comença al marge superior i al final es mostren les línies que caben dins del marge inferior.
- Fes zoom amb els botons de la previsualització o amb la roda del ratolí i arrossega el full per moure’l. Descarrega el PDF i imprimeix-lo al 100 % per conservar-ne les mesures. També pots imprimir el full directament des del menú d’impressió del navegador.

El web és a [pauta.ortogra.fi](https://pauta.ortogra.fi/). GitHub Pages publica `dist/` amb el flux de GitHub Actions quan canvia el web a `main`. L’avís de Pentagrama es mostra un segon després de carregar la pàgina i s’amaga al cap de dotze segons. El temporitzador es pausa quan el punter o el focus són dins l’avís.

A pauta.ortogra.fi, Umami compta les visites i registra un esdeveniment `sheet-output` quan es prem el botó de descarregar el PDF. L’esdeveniment recull el format, l’orientació, el nombre de línies de la pauta, l’espaiat, el gruix, el tipus de traç i si s’han activat les guies laterals o el codi imprès. Els noms de les plantilles, els codis i els fitxers es queden al dispositiu.

Projecte amb llicència [GNU GPL-3.0](LICENSE). Les [icones Lucide](https://lucide.dev/) es distribueixen sota les seves [llicències ISC i MIT](dist/lucide-LICENSE.txt).
