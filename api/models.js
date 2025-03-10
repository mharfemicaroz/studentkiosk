class User {
  constructor(id, name, type, password, username, online) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.password = password;
    this.username = username;
    this.online = online;
  }
}

class Student {
  constructor(
    id,
    studentNo,
    entryYear,
    courseCode,
    major,
    yrLevel,
    status,
    surname,
    firstname,
    middlename,
    address,
    birthday,
    birthplace,
    citizenship,
    religion,
    contactNo,
    sex,
    fatherName,
    fOccupation,
    motherName,
    mOccupation,
    guardian,
    gRelationship,
    gAddress,
    primarySchool,
    secondarySchool,
    tertiarySchool,
    tertiaryCourse,
    NSO,
    TOR,
    nsat,
    transferCredential,
    form,
    password,
    primaryYear,
    secondYear,
    tertiaryYear,
    studentPic,
    availed,
    optOut,
    voluntary,
    studentStatus,
    gContactNo,
    emailAd,
    zipcode,
    payee,
    gmcc,
    lastDateViewedGrades,
    street,
    shsEduc,
    shsGrad,
    tertiaryDegree,
    tertiaryUnits,
    shsTrack,
    category,
    entryDate,
    civilStatus,
    lrn
  ) {
    this.id = id;
    this.studentNo = studentNo;
    this.entryYear = entryYear;
    this.courseCode = courseCode;
    this.major = major;
    this.yrLevel = yrLevel;
    this.status = status;
    this.surname = surname;
    this.firstname = firstname;
    this.middlename = middlename;
    this.address = address;
    this.birthday = birthday;
    this.birthplace = birthplace;
    this.citizenship = citizenship;
    this.religion = religion;
    this.contactNo = contactNo;
    this.sex = sex;
    this.fatherName = fatherName;
    this.fOccupation = fOccupation;
    this.motherName = motherName;
    this.mOccupation = mOccupation;
    this.guardian = guardian;
    this.gRelationship = gRelationship;
    this.gAddress = gAddress;
    this.primarySchool = primarySchool;
    this.secondarySchool = secondarySchool;
    this.tertiarySchool = tertiarySchool;
    this.tertiaryCourse = tertiaryCourse;
    this.NSO = NSO;
    this.TOR = TOR;
    this.nsat = nsat;
    this.transferCredential = transferCredential;
    this.form = form;
    this.password = password;
    this.primaryYear = primaryYear;
    this.secondYear = secondYear;
    this.tertiaryYear = tertiaryYear;
    this.studentPic = studentPic;
    this.availed = availed;
    this.optOut = optOut;
    this.voluntary = voluntary;
    this.studentStatus = studentStatus;
    this.gContactNo = gContactNo;
    this.emailAd = emailAd;
    this.zipcode = zipcode;
    this.payee = payee;
    this.gmcc = gmcc;
    this.lastDateViewedGrades = lastDateViewedGrades;
    this.street = street;
    this.shsEduc = shsEduc;
    this.shsGrad = shsGrad;
    this.tertiaryDegree = tertiaryDegree;
    this.tertiaryUnits = tertiaryUnits;
    this.shsTrack = shsTrack;
    this.category = category;
    this.entryDate = entryDate;
    this.civilStatus = civilStatus;
    this.lrn = lrn;
  }
}

class Assessment {
  constructor(
    id,
    schoolYear,
    studentNo,
    semester,
    yrLevel,
    dateEnrolled,
    lastTimeUpdated,
    courseCode,
    status,
    encoder,
    scholarshipId,
    tuitionId,
    totalUnits,
    scholarshipStatus,
    accountStatus,
    downPayment,
    batchId,
    batchFlag,
    discountId,
    discountStatus,
    major,
    category
  ) {
    this.id = id;
    this.schoolYear = schoolYear;
    this.studentNo = studentNo;
    this.semester = semester;
    this.yrLevel = yrLevel;
    this.dateEnrolled = dateEnrolled;
    this.lastTimeUpdated = lastTimeUpdated;
    this.courseCode = courseCode;
    this.status = status;
    this.encoder = encoder;
    this.scholarshipId = scholarshipId;
    this.tuitionId = tuitionId;
    this.totalUnits = totalUnits;
    this.scholarshipStatus = scholarshipStatus;
    this.accountStatus = accountStatus;
    this.downPayment = downPayment;
    this.batchId = batchId;
    this.batchFlag = batchFlag;
    this.discountId = discountId;
    this.discountStatus = discountStatus;
    this.major = major;
    this.category = category;
  }
}

class Schedule {
  constructor(
    id,
    subjectNoCode,
    subjectCode,
    subjectDesc,
    term,
    section,
    day,
    time,
    units,
    assessmentId,
    roomNo,
    addDropFlag,
    labUnits,
    majorUnits,
    lectureUnits
  ) {
    this.id = id;
    this.subjectNoCode = subjectNoCode;
    this.subjectCode = subjectCode;
    this.subjectDesc = subjectDesc;
    this.term = term;
    this.section = section;
    this.day = day;
    this.time = time;
    this.units = units;
    this.assessmentId = assessmentId;
    this.roomNo = roomNo;
    this.addDropFlag = addDropFlag;
    this.labUnits = labUnits;
    this.majorUnits = majorUnits;
    this.lectureUnits = lectureUnits;
  }
}

module.exports = { User, Student, Assessment, Schedule };
