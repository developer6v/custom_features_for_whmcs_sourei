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
