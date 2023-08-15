const plan = {
  id: '10001-auto-battery-12-23-base-replace-1y',
  name: 'Extend Protection Plan - Auto Battery',
  active: true,
  secondary_name: 'Auto Battery',
  contract: {
    category: 'auto_parts',
    coverage_starts: 'after',
    coverage_includes: 'base',
    deductible: 0,
    pcmi_category: 'Automotive',
    pcmi_subcategory: 'Battery',
    replacement_type: 'new',
    service_type: 'replace',
    term_length: 12,
    servicer_ids: ['123'],
  },
  administrator: 'Aon',
  pricing: [
    {
      price_high: 9999,
      price_low: 0,
      retail_max: 0.3,
      retail_min: 0,
      retail_target: 0.1,
    },
    {
      price_high: 14999,
      price_low: 10000,
      retail_max: 0.3,
      retail_min: 0,
      retail_target: 0.1,
    },
  ],
  matching: [
    {
      cost: 1005,
      price_high: 9999,
      price_low: 0,
      vendor_sku: 'EXTABATT29',
    },
    {
      cost: 1918,
      price_high: 14999,
      price_low: 10000,
      vendor_sku: 'EXTABATT30',
    },
  ],
  allowed_regions: ['US'],
  blocked_sub_division: ['CA'],
  product_notes: "Auto battery with manufacturer's warranty 12-23 months long",
  product_types: 'Auto battery (mfr warranty 12-23)',
  tags: 'tags',
  termsId: 'TERMS-ID-MOCK',
  underwriter: 'Fortegra',
  vendor: 'Aon',
  currency_code: 'USD',
  repair_threshold: 500,
  program: 'test-program',
  sub_program: 'test-sub-program',
  plan_category: 'test-plan-category',
  wd_tags: ['test-wd-tag'],
}

// iterate over all the keys in the plan object
Object.keys(plan).forEach(key => {
  console.log(key, plan[key])
})
