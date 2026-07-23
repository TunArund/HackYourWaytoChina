# Long-term Version — Data Gaps & Future Improvements

Created: 2026-07-23

## Missing Translations

The following languages need L1-L8 translations (currently fall back to English via the i18n fallback system):

- [ ] **ja.json** — Japanese
- [ ] **ko.json** — Korean
- [ ] **ru.json** — Russian
- [ ] **vi.json** — Vietnamese

The fallback system (`i18n.js` `_fallback()`) automatically serves English content when keys are missing, so the pages are functional but not translated.

## Content Areas Needing Further Research

### L1 — Status Transfer
- [ ] **Path A (Tourist→Work)**: Per-city rules on in-country conversion vary significantly. Current text advises calling 12367. A table of known per-city policies would be more useful.
- [ ] **K Visa "renowned universities" list**: Not yet published by Chinese authorities (expected late 2026). Placeholder text currently reads "recognized university."
- [ ] **K Visa age limit**: Officially targets "young" professionals but no hard cutoff published. Sources suggest ~40 but this needs confirmation when detailed rules are released.

### L2 — Work & Residence Permits
- [ ] **One-stop portal rollout status**: The national platform (www.12333.gov.cn) is being rolled out city by city. A city-by-city status table would help users know if their city supports it.
- [ ] **Points calculator**: The points-based classification (A/B/C) could use an interactive calculator widget (similar to S1 visa checker).

### L3 — Phone + Bank
- [ ] **Class I vs Class II account rules**: Requirements vary by bank branch. Some branches reportedly upgrade foreigners to Class I immediately with a residence permit; others require 3-6 months of account history.
- [ ] **Cross-border transfer limits**: SWIFT transfer limits and fees vary by bank. A comparison table would be useful.

### L4 — Housing
- [ ] **Rental costs**: Prices as of mid-2026. Should be updated every 6-12 months.
- [ ] **Online registration cities**: Currently 7 pilot cities. More cities expected to join in 2026-2027.

### L5 — Health + Social Insurance
- [ ] **Bilateral agreement status**: The France agreement is "signed but not yet in force" as of early 2026. Check status.
- [ ] **Contribution rates**: City-specific rates vary. Current data uses Shanghai/Beijing averages.
- [ ] **Private insurance costs**: ¥15K-50K range is broad. Detailed plan comparison would be helpful.

### L6 — Drive + School
- [ ] **Direct license swap countries**: Full list of countries with reciprocal agreements needed. Currently only mentions Belgium and France.
- [ ] **School tuition**: Prices fluctuate. Data from 2025-2026 academic year. Update annually.
- [ ] **School waitlist status**: Varies. ISB Beijing and some Shanghai schools have 1-2 year waitlists.

### L7 — Daily Life
- [ ] **Most content is evergreen** but app/service names could change (e.g., if platforms rebrand or merge).

### L8 — Compliance + Emergency
- [ ] **Green card income threshold**: "2-6x local average" is a wide range. The specific multiplier depends on the application category (work, family, investment, talent). Detailed breakdown needed.
- [ ] **Green card quota**: Annual quotas exist but numbers aren't published. Processing time varies significantly by city.

## Structural Improvements (Future)

| # | Idea | Priority |
|---|------|----------|
| 1 | Interactive S1-style checker for L1 (which pathway fits my situation?) | 🟡 Medium |
| 2 | L2 points calculator widget | 🟢 Low |
| 3 | Image/screenshot support for L3 (bank app screenshots, SIM card packages) | 🟡 Medium |
| 4 | L4 interactive map of expat neighborhoods | 🟢 Low |
| 5 | L5 social insurance calculator (estimate your contributions + employer cost) | 🟢 Low |

## Sources Used

- [China K Visa 2026 Guide (MS Advisory)](https://msadvisory.com/china-k-visa/)
- [China Work Permit 2026 Guide (HiredChina)](https://www.hiredchina.com/articles/china-work-permit-2026-reform/)
- [China Social Insurance for Foreigners 2026 (HiredChina)](https://www.hiredchina.com/articles/foreigners-social-insurance-china-2026/)
- [China Social Security 2026 (MS Advisory)](https://msadvisory.com/china-social-security-system/)
- [NIA Official Site](https://en.nia.gov.cn)
- [12333 Portal](https://www.12333.gov.cn)
