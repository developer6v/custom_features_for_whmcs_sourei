/* CountrySelect.js */
(function (root) {
  const ALL_REGION_CODES = ("AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI KH CM CA CV KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MK MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW").split(" ");

  function getCountryLabel(code, lang) {
    try {
      const dn = new Intl.DisplayNames([lang], { type: 'region' });
      return dn.of(code) || code;
    } catch {
      return code;
    }
  }

  function buildOptions(lang, preferredCodes) {
    const preferred = [];
    const others = [];
    const prefSet = new Set((preferredCodes || []).filter(Boolean));

    ALL_REGION_CODES.forEach(code => {
      const label = getCountryLabel(code, lang);
      const opt = new Option(label, code);
      if (prefSet.has(code)) preferred.push(opt);
      else others.push(opt);
    });

    preferred.sort((a, b) => a.text.localeCompare(b.text));
    others.sort((a, b) => a.text.localeCompare(b.text));
    return { preferred, others };
  }

  function populate(selectOrId, lang, preferredCodes) {
    const sel = typeof selectOrId === 'string' ? document.getElementById(selectOrId) : selectOrId;
    if (!sel) return;

    const current = sel.value;
    sel.innerHTML = "";

    const { preferred, others } = buildOptions(lang || 'en-US', preferredCodes);

    if (preferred.length) {
      const og = document.createElement('optgroup');
      og.label = '★';
      preferred.forEach(o => og.appendChild(o));
      sel.appendChild(og);
      const divider = new Option('──────────', '');
      divider.disabled = true;
      sel.appendChild(divider);
    }
    others.forEach(o => sel.appendChild(o));

    if (current && [...sel.options].some(o => o.value === current)) {
      sel.value = current;
    } else if (preferred.length) {
      sel.value = preferred[0].value;
    }
  }

  function relabel(selectOrId, lang) {
    const sel = typeof selectOrId === 'string' ? document.getElementById(selectOrId) : selectOrId;
    if (!sel) return;

    const current = sel.value;
    [...sel.options].forEach(opt => {
      if (!opt.value) return;
      opt.text = getCountryLabel(opt.value, lang || 'en-US');
    });
    try {
      const groups = sel.querySelectorAll('optgroup[label="★"]');
      groups.forEach(g => {
        const opts = [...g.children];
        opts.sort((a, b) => a.text.localeCompare(b.text));
        opts.forEach(o => g.appendChild(o));
      });
      const flat = [...sel.options].filter(o => o.parentElement === sel && o.value);
      flat.sort((a, b) => a.text.localeCompare(b.text));
      flat.forEach(o => sel.appendChild(o));
    } catch {}
    if (current) sel.value = current;
  }

  root.CountrySelect = { populate, relabel, getCountryLabel };
})(window);

/* COMO USAR COM O SEU FORM */

// 1) Ao montar a estrutura (ex.: no final de setupFormStructure ou logo após createStepHeader):
// CountrySelect.populate('inputCountry', window.FormGeoI18n.getCountryLanguage('BR'), ['BR','US','PT','ES','FR','DE','IT','GB','AR','MX']);

// 2) Quando trocar o idioma (dentro de translatePage(language)):
// CountrySelect.relabel('inputCountry', language);

// 3) Se você quiser sincronizar também o seletor do header (se existir um <select id="headerCountrySelect">):
// CountrySelect.populate('headerCountrySelect', window.FormGeoI18n.getCountryLanguage('BR'), ['BR','US','PT','ES','FR','DE','IT','GB','AR','MX']);
// E mantenha o listener de sincronização que você já tem entre headerCountrySelect e inputCountry.


(function (root) {
  const Translations = {
    'pt-BR': {
      stepTitles: ['Dados Pessoais', 'Endereço', 'Segurança'],
      stepSubtitles: [
        'Preencha suas informações básicas',
        'Informe seu endereço completo',
        'Crie sua senha de acesso'
      ],
      fullName: 'Nome Completo',
      phone: 'Telefone',
      email: 'E-mail',
      birthdate: 'Data de Nascimento',
      company: 'Empresa',
      country: 'País',
      postalCode: 'CEP',
      address: 'Endereço',
      addressNumber: 'Número',
      neighborhood: 'Bairro',
      complement: 'Complemento',
      city: 'Cidade',
      state: 'Estado',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
      fullNamePlaceholder: 'Digite seu nome completo',
      emailPlaceholder: 'seu@email.com',
      birthdatePlaceholder: 'DD/MM/AAAA',
      postalCodePlaceholder: '00000-000',
      addressPlaceholder: 'Rua, Avenida, etc.',
      numberPlaceholder: 'Nº',
      neighborhoodPlaceholder: 'Bairro',
      complementPlaceholder: 'Apto, Bloco, etc.',
      cityPlaceholder: 'Cidade',
      statePlaceholder: 'Selecione um estado',
      legalPerson: 'Sou Pessoa Jurídica (usar CNPJ)',
      nextButton: 'Próximo',
      prevButton: 'Voltar',
      finishButton: 'Finalizar',
      summaryPersonalData: 'Seus Dados Pessoais',
      summaryPersonalDataTitle: 'Dados Pessoais',
      summaryAddressTitle: 'Endereço',
      validating: 'Validando...',
      errorRequired: 'Este campo é obrigatório.',
      errorEmail: 'E-mail inválido.',
      errorFullName: 'Por favor, insira nome e sobrenome',
      errorCep: 'CEP inválido. Verifique e tente novamente.',
      errorCepFetch: 'Erro ao buscar CEP. Tente novamente.',
      errorEmailExists: 'E-mail já cadastrado.',
      errorCpfExists: 'CPF já cadastrado.',
      errorNetwork: 'Erro de validação. Tente novamente.'
    },
    'en-US': {
      stepTitles: ['Personal Information', 'Address', 'Security'],
      stepSubtitles: [
        'Fill in your basic information',
        'Enter your complete address',
        'Create your access password'
      ],
      fullName: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      birthdate: 'Date of Birth',
      company: 'Company',
      country: 'Country',
      postalCode: 'Zip Code',
      address: 'Address',
      addressNumber: 'Number',
      neighborhood: 'Neighborhood',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullNamePlaceholder: 'Enter your full name',
      emailPlaceholder: 'your@email.com',
      birthdatePlaceholder: 'MM/DD/YYYY',
      postalCodePlaceholder: 'e.g., 90210',
      addressPlaceholder: 'Street, Avenue, etc.',
      numberPlaceholder: 'No.',
      neighborhoodPlaceholder: 'Neighborhood',
      complementPlaceholder: 'Apt, Unit, etc.',
      cityPlaceholder: 'City',
      statePlaceholder: 'Select a state',
      legalPerson: 'I am a Legal Entity (use EIN)',
      nextButton: 'Next',
      prevButton: 'Back',
      finishButton: 'Finish',
      summaryPersonalData: 'Your Personal Information',
      summaryPersonalDataTitle: 'Personal Information',
      summaryAddressTitle: 'Address',
      validating: 'Validating...',
      errorRequired: 'This field is required.',
      errorEmail: 'Invalid email.',
      errorFullName: 'Please enter first and last name',
      errorCep: 'Invalid ZIP code. Please verify and try again.',
      errorCepFetch: 'Error fetching ZIP code. Please try again.',
      errorEmailExists: 'Email already exists.',
      errorCpfExists: 'SSN already exists.',
      errorNetwork: 'Validation error. Please try again.'
    },
    'es-ES': {
      stepTitles: ['Datos Personales', 'Dirección', 'Seguridad'],
      stepSubtitles: [
        'Complete su información básica',
        'Ingrese su dirección completa',
        'Cree su contraseña de acceso'
      ],
      fullName: 'Nombre Completo',
      phone: 'Teléfono',
      email: 'Correo Electrónico',
      birthdate: 'Fecha de Nacimiento',
      company: 'Empresa',
      country: 'País',
      postalCode: 'Código Postal',
      address: 'Dirección',
      addressNumber: 'Número',
      neighborhood: 'Barrio',
      complement: 'Complemento',
      city: 'Ciudad',
      state: 'Estado',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      fullNamePlaceholder: 'Ingrese su nombre completo',
      emailPlaceholder: 'su@email.com',
      birthdatePlaceholder: 'DD/MM/AAAA',
      postalCodePlaceholder: '00000',
      addressPlaceholder: 'Calle, Avenida, etc.',
      numberPlaceholder: 'Nº',
      neighborhoodPlaceholder: 'Barrio',
      complementPlaceholder: 'Piso, Depto, etc.',
      cityPlaceholder: 'Ciudad',
      statePlaceholder: 'Seleccione un estado',
      legalPerson: 'Soy Persona Jurídica (usar CIF)',
      nextButton: 'Siguiente',
      prevButton: 'Volver',
      finishButton: 'Finalizar',
      summaryPersonalData: 'Sus Datos Personales',
      summaryPersonalDataTitle: 'Datos Personales',
      summaryAddressTitle: 'Dirección',
      validating: 'Validando...',
      errorRequired: 'Este campo es obligatorio.',
      errorEmail: 'Correo electrónico inválido.',
      errorFullName: 'Por favor, ingrese nombre y apellido',
      errorCep: 'Código postal inválido. Verifique e intente nuevamente.',
      errorCepFetch: 'Error al buscar código postal. Intente nuevamente.',
      errorEmailExists: 'Correo ya registrado.',
      errorCpfExists: 'Documento ya registrado.',
      errorNetwork: 'Error de validación. Intente nuevamente.'
    },
    'pt-PT': {
      stepTitles: ['Dados Pessoais', 'Morada', 'Segurança'],
      stepSubtitles: [
        'Preencha as suas informações básicas',
        'Indique a sua morada completa',
        'Crie a sua palavra-passe de acesso'
      ],
      fullName: 'Nome Completo',
      phone: 'Telefone',
      email: 'E-mail',
      birthdate: 'Data de Nascimento',
      company: 'Empresa',
      country: 'País',
      postalCode: 'Código Postal',
      address: 'Morada',
      addressNumber: 'Número',
      neighborhood: 'Freguesia',
      complement: 'Complemento',
      city: 'Cidade',
      state: 'Distrito',
      password: 'Palavra-passe',
      confirmPassword: 'Confirmar Palavra-passe',
      fullNamePlaceholder: 'Introduza o seu nome completo',
      emailPlaceholder: 'seu@email.com',
      birthdatePlaceholder: 'DD/MM/AAAA',
      postalCodePlaceholder: '0000-000',
      addressPlaceholder: 'Rua, Avenida, etc.',
      numberPlaceholder: 'Nº',
      neighborhoodPlaceholder: 'Freguesia',
      complementPlaceholder: 'Andar, Porta, etc.',
      cityPlaceholder: 'Cidade',
      statePlaceholder: 'Selecione um distrito',
      legalPerson: 'Sou Pessoa Coletiva (usar NIPC)',
      nextButton: 'Seguinte',
      prevButton: 'Voltar',
      finishButton: 'Finalizar',
      summaryPersonalData: 'Os Seus Dados Pessoais',
      summaryPersonalDataTitle: 'Dados Pessoais',
      summaryAddressTitle: 'Morada',
      validating: 'A validar...',
      errorRequired: 'Este campo é obrigatório.',
      errorEmail: 'E-mail inválido.',
      errorFullName: 'Por favor, introduza nome e apelido',
      errorCep: 'Código postal inválido. Verifique e tente novamente.',
      errorCepFetch: 'Erro ao buscar código postal. Tente novamente.',
      errorEmailExists: 'E-mail já existente.',
      errorCpfExists: 'NIF já existente.',
      errorNetwork: 'Erro de validação. Tente novamente.'
    },
    'fr-FR': {
      stepTitles: ['Données Personnelles', 'Adresse', 'Sécurité'],
      stepSubtitles: [
        'Remplissez vos informations de base',
        'Entrez votre adresse complète',
        'Créez votre mot de passe d\'accès'
      ],
      fullName: 'Nom Complet',
      phone: 'Téléphone',
      email: 'E-mail',
      birthdate: 'Date de Naissance',
      company: 'Entreprise',
      country: 'Pays',
      postalCode: 'Code Postal',
      address: 'Adresse',
      addressNumber: 'Numéro',
      neighborhood: 'Quartier',
      complement: 'Complément',
      city: 'Ville',
      state: 'Région',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      fullNamePlaceholder: 'Entrez votre nom complet',
      emailPlaceholder: 'votre@email.com',
      birthdatePlaceholder: 'JJ/MM/AAAA',
      postalCodePlaceholder: '00000',
      addressPlaceholder: 'Rue, Avenue, etc.',
      numberPlaceholder: 'Nº',
      neighborhoodPlaceholder: 'Quartier',
      complementPlaceholder: 'Apt, Bât, etc.',
      cityPlaceholder: 'Ville',
      statePlaceholder: 'Sélectionnez une région',
      legalPerson: 'Je suis une Personne Morale (utiliser SIRET)',
      nextButton: 'Suivant',
      prevButton: 'Retour',
      finishButton: 'Terminer',
      summaryPersonalData: 'Vos Données Personnelles',
      summaryPersonalDataTitle: 'Données Personnelles',
      summaryAddressTitle: 'Adresse',
      validating: 'Validation...',
      errorRequired: 'Ce champ est obligatoire.',
      errorEmail: 'E-mail invalide.',
      errorFullName: 'Veuillez entrer le prénom et le nom',
      errorCep: 'Code postal invalide. Veuillez vérifier et réessayer.',
      errorCepFetch: 'Erreur lors de la récupération du code postal. Veuillez réessayer.',
      errorEmailExists: 'E-mail déjà enregistré.',
      errorCpfExists: 'ID déjà enregistré.',
      errorNetwork: 'Erreur de validation. Veuillez réessayer.'
    }
  };
  const LangByCountry = {
    BR:'pt-BR', PT:'pt-PT',
    US:'en-US', GB:'en-US', CA:'en-US', AU:'en-US', NZ:'en-US', IE:'en-US',
    ZA:'en-US', IN:'en-US', SG:'en-US', PH:'en-US', HK:'en-US',
    ES:'es-ES', MX:'es-ES', AR:'es-ES', CL:'es-ES', CO:'es-ES', PE:'es-ES', UY:'es-ES', PY:'es-ES', BO:'es-ES', EC:'es-ES', VE:'es-ES', PA:'es-ES', CR:'es-ES', GT:'es-ES', SV:'es-ES', HN:'es-ES', NI:'es-ES', DO:'es-ES', PR:'es-ES',
    FR:'fr-FR', BE:'fr-FR', CH:'fr-FR', LU:'fr-FR', MC:'fr-FR',
    IT:'en-US', DE:'en-US', AT:'en-US', NL:'en-US', DK:'en-US', NO:'en-US', SE:'en-US', FI:'en-US', IS:'en-US', GR:'en-US', TR:'en-US', PL:'en-US', CZ:'en-US', SK:'en-US', HU:'en-US', RO:'en-US', BG:'en-US', HR:'en-US', SI:'en-US', LT:'en-US', LV:'en-US', EE:'en-US', RU:'en-US', UA:'en-US',
    JP:'en-US', KR:'en-US', CN:'en-US', TW:'en-US', TH:'en-US', MY:'en-US', ID:'en-US', VN:'en-US',
    AE:'en-US', SA:'en-US', QA:'en-US', KW:'en-US', BH:'en-US', OM:'en-US', JO:'en-US', IL:'en-US', EG:'en-US', MA:'en-US', DZ:'en-US', TN:'en-US', NG:'en-US', KE:'en-US', GH:'en-US'
  };

  const DocLabels = {
    BR:{ person:{label:'CPF',  ph:'000.000.000-00'},  company:{label:'CNPJ',    ph:'00.000.000/0000-00'} },
    US:{ person:{label:'SSN',  ph:'000-00-0000'},     company:{label:'EIN',     ph:'00-0000000'} },
    CA:{ person:{label:'SIN',  ph:'000-000-000'},     company:{label:'BN',      ph:'000000000'} },
    GB:{ person:{label:'NINo', ph:'QQ 12 34 56 C'},   company:{label:'CRN',     ph:''} },
    AU:{ person:{label:'TFN',  ph:'000 000 000'},     company:{label:'ABN',     ph:'00 000 000 000'} },
    NZ:{ person:{label:'IRD',  ph:'00-000-000'},      company:{label:'NZBN',    ph:''} },
    PT:{ person:{label:'NIF',  ph:'000000000'},       company:{label:'NIPC',    ph:'000000000'} },
    ES:{ person:{label:'DNI',  ph:'00000000A'},       company:{label:'CIF',     ph:'A00000000'} },
    AR:{ person:{label:'DNI',  ph:'00.000.000'},      company:{label:'CUIT',    ph:'00-00000000-0'} },
    MX:{ person:{label:'CURP', ph:'AAAA000000AAAAAA00'}, company:{label:'RFC',  ph:'AAA000000AA0'} },
    CL:{ person:{label:'RUT',  ph:'12.345.678-5'},    company:{label:'RUT',     ph:'12.345.678-5'} },
    CO:{ person:{label:'CC',   ph:''},                company:{label:'NIT',     ph:'000.000.000-0'} },
    PE:{ person:{label:'DNI',  ph:'00000000'},        company:{label:'RUC',     ph:'00000000000'} },
    FR:{ person:{label:'INSEE',ph:''},                company:{label:'SIREN',   ph:'000 000 000'} },
    DE:{ person:{label:'ID',   ph:''},                company:{label:'USt-IdNr.',ph:'DE000000000'} },
    IT:{ person:{label:'Codice Fiscale', ph:'RSSMRA00A01H501U'}, company:{label:'P.IVA', ph:'00000000000'} },
    IN:{ person:{label:'PAN',  ph:'ABCDE1234F'},      company:{label:'GSTIN',   ph:'22AAAAA0000A1Z5'} },
    IE:{ person:{label:'PPS',  ph:''},                company:{label:'VAT',     ph:'IE1234567A'} },
    NL:{ person:{label:'BSN',  ph:''},                company:{label:'KVK',     ph:''} },
    BE:{ person:{label:'NN',   ph:''},                company:{label:'BCE',     ph:''} },
    CH:{ person:{label:'AHV',  ph:''},                company:{label:'UID',     ph:'CHE-000.000.000'} },
    JP:{ person:{label:'My Number', ph:'0000-0000-0000'}, company:{label:'Houjin Bangou', ph:'0000000000000'} },
    KR:{ person:{label:'RRN',  ph:''},                company:{label:'BRN',     ph:''} },
    DEFAULT:{ person:{label:'ID', ph:''}, company:{label:'Business ID', ph:''} }
  };
  const States = {
    US: {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"},
    BR: {"AC":"Acre","AL":"Alagoas","AP":"Amapá","AM":"Amazonas","BA":"Bahia","CE":"Ceará","DF":"Distrito Federal","ES":"Espírito Santo","GO":"Goiás","MA":"Maranhão","MT":"Mato Grosso","MS":"Mato Grosso do Sul","MG":"Minas Gerais","PA":"Pará","PB":"Paraíba","PR":"Paraná","PE":"Pernambuco","PI":"Piauí","RJ":"Rio de Janeiro","RN":"Rio Grande do Norte","RS":"Rio Grande do Sul","RO":"Rondônia","RR":"Roraima","SC":"Santa Catarina","SP":"São Paulo","SE":"Sergipe","TO":"Tocantins"},
    CA: {"AB":"Alberta","BC":"British Columbia","MB":"Manitoba","NB":"New Brunswick","NL":"Newfoundland and Labrador","NS":"Nova Scotia","NT":"Northwest Territories","NU":"Nunavut","ON":"Ontario","PE":"Prince Edward Island","QC":"Quebec","SK":"Saskatchewan","YT":"Yukon"},
    AU: {"ACT":"Australian Capital Territory","NSW":"New South Wales","NT":"Northern Territory","QLD":"Queensland","SA":"South Australia","TAS":"Tasmania","VIC":"Victoria","WA":"Western Australia"},
    MX: {"AGU":"Aguascalientes","BCN":"Baja California","BCS":"Baja California Sur","CAM":"Campeche","CHP":"Chiapas","CHH":"Chihuahua","COA":"Coahuila","COL":"Colima","CMX":"Ciudad de México","DUR":"Durango","GUA":"Guanajuato","GRO":"Guerrero","HID":"Hidalgo","JAL":"Jalisco","MEX":"México","MIC":"Michoacán","MOR":"Morelos","NAY":"Nayarit","NLE":"Nuevo León","OAX":"Oaxaca","PUE":"Puebla","QUE":"Querétaro","ROO":"Quintana Roo","SLP":"San Luis Potosí","SIN":"Sinaloa","SON":"Sonora","TAB":"Tabasco","TAM":"Tamaulipas","TLA":"Tlaxcala","VER":"Veracruz","YUC":"Yucatán","ZAC":"Zacatecas"},
    AR: {"BA":"Buenos Aires","CABA":"Ciudad Autónoma de Buenos Aires","CAT":"Catamarca","CHA":"Chaco","CHU":"Chubut","COR":"Córdoba","CRR":"Corrientes","ENT":"Entre Ríos","FOR":"Formosa","JUJ":"Jujuy","LAP":"La Pampa","LAR":"La Rioja","MEN":"Mendoza","MIS":"Misiones","NEU":"Neuquén","RNE":"Río Negro","SAL":"Salta","SJU":"San Juan","SLU":"San Luis","SC":"Santa Cruz","SFE":"Santa Fe","SDE":"Santiago del Estero","TF":"Tierra del Fuego","TUC":"Tucumán"},
    ES: {"AN":"Andalucía","AR":"Aragón","AS":"Asturias","CN":"Canarias","CB":"Cantabria","CL":"Castilla y León","CM":"Castilla-La Mancha","CT":"Cataluña","CE":"Ceuta","EX":"Extremadura","GA":"Galicia","IB":"Islas Baleares","RI":"La Rioja","MD":"Madrid","MC":"Murcia","NC":"Navarra","PV":"País Vasco","ML":"Melilla"},
    PT: {"AV":"Aveiro","BE":"Beja","BR":"Braga","BG":"Bragança","CB":"Castelo Branco","CO":"Coimbra","EV":"Évora","FA":"Faro","GU":"Guarda","LE":"Leiria","LI":"Lisboa","PA":"Portalegre","PO":"Porto","SA":"Santarém","SE":"Setúbal","VC":"Viana do Castelo","VR":"Vila Real","VI":"Viseu","AC":"Açores","MA":"Madeira"},
    DE: {"BW":"Baden-Württemberg","BY":"Bayern","BE":"Berlin","BB":"Brandenburg","HB":"Bremen","HH":"Hamburg","HE":"Hessen","MV":"Mecklenburg-Vorpommern","NI":"Niedersachsen","NW":"Nordrhein-Westfalen","RP":"Rheinland-Pfalz","SL":"Saarland","SN":"Sachsen","ST":"Sachsen-Anhalt","SH":"Schleswig-Holstein","TH":"Thüringen"},
    FR: {"ARA":"Auvergne-Rhône-Alpes","BFC":"Bourgogne-Franche-Comté","BRE":"Bretagne","CVL":"Centre-Val de Loire","COR":"Corse","GES":"Grand Est","HDF":"Hauts-de-France","IDF":"Île-de-France","NOR":"Normandie","NAQ":"Nouvelle-Aquitaine","OCC":"Occitanie","PDL":"Pays de la Loire","PAC":"Provence-Alpes-Côte d’Azur"}
  };

  const PhoneMaxDigits = {
    US:10, CA:10, BR:11, GB:10, FR:9, DE:11, IT:10, ES:9, PT:9, AR:10, CL:9, CO:10, PE:9, MX:10,
    AU:9, NZ:9, IE:9, NL:9, BE:9, CH:9, JP:10, KR:10, CN:11, HK:8, SG:8, MY:9, TH:9, ID:11, VN:10,
    AE:9, SA:9, QA:8, KW:8, BH:8, OM:8, IL:9, EG:10, MA:9, DZ:9, TN:8, KE:9, NG:10, GH:9, UA:9, RU:10
  };

  const API = {
    getTranslation(lang){ return Translations[lang] || Translations['en-US']; },
    getCountryLanguage(countryCode){ return LangByCountry[countryCode] || 'en-US'; },
    getDocLabels(countryCode){ return DocLabels[countryCode] || DocLabels.DEFAULT; },
    getStates(countryCode){ return States[countryCode] || {}; },
    getPhoneMaxDigits(countryCode){ return PhoneMaxDigits[countryCode] || 15; }
  };

  root.FormGeoI18n = API;
})(window);
