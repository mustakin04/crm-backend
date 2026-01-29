const normalizeKey = (key = "") =>
  key.toLowerCase().replace(/\s+/g, "").replace(/_/g, "");

/**
 * CSV row → Lead document mapper
 * @param {Object} row CSV row
 * @param {String} userId Logged-in user _id
 * @returns Lead object ready for insert
 */
const mapRowToLead = (row, userId) => {
  const mapped = {};

  for (let key in row) {
    const normalized = normalizeKey(key);

    // Personal Info
    if (normalized === "firstname") mapped.firstName = row[key];
    if (normalized === "middlename") mapped.middleName = row[key];
    if (normalized === "lastname") mapped.lastName = row[key];
    if (normalized === "dob") mapped.dob = row[key] ? new Date(row[key]) : null;
    if (normalized === "passport") mapped.passport = row[key];
    if (normalized === "nationality") mapped.nationality = row[key];
    if (normalized === "civilstatus") mapped.civilStatus = row[key];

    // Contact Info
    if (normalized === "email") mapped.email = row[key];
    if (normalized === "phone" || normalized === "mobilenumber") mapped.phone = row[key];
    if (normalized === "emergencycontact") mapped.emergencyContact = row[key];
    if (normalized === "emergencyphone") mapped.emergencyPhone = row[key];
    if (normalized === "currentlocation") mapped.currentLocation = row[key];
    if (normalized === "address") mapped.address = row[key];
    if (normalized === "policestation") mapped.policeStation = row[key];
    if (normalized === "district") mapped.district = row[key];

    // Responsibility & Services
    if (normalized === "responsetype" || normalized === "responsibletype") mapped.responsibleType = row[key];
    if (normalized === "prefservice") mapped.prefService = row[key];
    if (normalized === "firstservicepref") mapped.firstServicePref = row[key];
    if (normalized === "secondservicepref") mapped.secondServicePref = row[key];
    if (normalized === "campaigncode") mapped.campaignCode = row[key];

    // Lead Tracking
    if (normalized === "stage") mapped.stage = row[key];
    if (normalized === "type") mapped.type = row[key];
    if (normalized === "responsible") mapped.responsible = row[key];
    if (normalized === "ref") mapped.refType = row[key];
    if (normalized === "source") mapped.refType = row[key]; // alternative column name
    if (normalized === "referredby") mapped.referredBy = row[key];
    if (normalized === "nextaction") mapped.nextAction = row[key];
    if (normalized === "nextactiondate") mapped.nextActionDate = row[key] ? new Date(row[key]) : null;

    // Additional
    if (normalized === "agentpromo") mapped.agentPromo = row[key];
    if (normalized === "active") mapped.active = row[key];
    if (normalized === "description") mapped.description = row[key];

    // Optional: Lead Owner & Account
    if (normalized === "leadowner") mapped.leadOwner = row[key];
    if (normalized === "account") mapped.account = row[key];
  }

  // Always required
  return {
    createdBy: userId,
    ...mapped,
  };
};

module.exports = mapRowToLead;
