const normalizeAddressText = (text) => String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

function stripAdministrativePrefix (value) {
    return normalizeAddressText(value)
      .replace(/^(phuong|p|xa|x|thi tran|tt|quan|q|huyen|h|thi xa|tx|thanh pho|tp|tinh|ward|district|city|province|street|st)[\s.,-]+/g, '')
      .replace(/[\s.,-]+(ward|district|city|province|street|county)$/g, '')
      .replace(/\s+/g, ' ')
      .trim()
}

let streetAddress = "42 kim giang"
let selectedWard = { name: "Phường Khương Đình" }
let selectedDistrict = { name: "Quận Thanh Xuân" }
let selectedProvince = { name: "Thành phố Hà Nội" }

function buildCurrentAddressString (addressText = streetAddress) {
    const str = String(addressText || '').trim()
    const parts = [str]
    const norm = normalizeAddressText(str)

    const ward = selectedWard?.name
    if (ward) {
      const bare = stripAdministrativePrefix(ward)
      if (bare && !norm.includes(bare)) parts.push(ward)
    }
    const district = selectedDistrict?.name
    if (district) {
      const bare = stripAdministrativePrefix(district)
      if (bare && !norm.includes(bare)) parts.push(district)
    }
    const province = selectedProvince?.name
    if (province) {
      const bare = stripAdministrativePrefix(province)
      if (bare && !norm.includes(bare)) parts.push(province)
    }
    return parts.filter(Boolean).join(', ')
}

console.log("Result:", buildCurrentAddressString())
