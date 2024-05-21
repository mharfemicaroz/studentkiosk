<template>
  <form @submit.prevent="addStudent">
    <!-- Admission Info -->
    <div class="row">
      <div class="col-12">
        <h5 class="form-title"><span>Admission Info</span></h5>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Student ID <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.studentno"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Course <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.coursecode"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Major <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.major"
          />
        </div>
      </div>
    </div>

    <!-- Personal Info -->
    <div class="row">
      <div class="col-12">
        <h5 class="form-title"><span>Personal Info</span></h5>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Last Name <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.surname"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>First Name <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.firstname"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Middle Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.middlename"
          />
        </div>
      </div>
      <div class="col-4">
        <div class="form-group">
          <label>Date of Birth <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.birthday"
          />
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label>Place of Birth</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.birthplace"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Sex <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.sex"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Civil Status</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.civilstatus"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Religion</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.religion"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Citizenship <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.citizenship"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Contact No. <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.contactno"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Email Address <span class="login-danger"></span></label>
          <input
            type="email"
            class="form-control"
            readonly
            v-model="studentinfo.emailad"
          />
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label
            >Street/House No./Prk. <span class="login-danger"></span
          ></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.street"
          />
        </div>
      </div>
      <div class="col-4">
        <div class="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.zipcode"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>Permanent Address <span class="login-danger"></span></label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.adress"
          />
        </div>
      </div>
    </div>

    <!-- Family Background -->
    <div class="row">
      <div class="col-12">
        <h5 class="form-title"><span>Family Background</span></h5>
      </div>
      <!-- Father's Details -->
      <div class="col-12">
        <h6>Father's Details</h6>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.fathername"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Occupation</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.foccupation"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Contact No.</label>
          <input type="text" class="form-control" readonly />
        </div>
      </div>

      <!-- Mother's Details -->
      <div class="col-12">
        <h6>Mother's Details</h6>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.mothername"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Occupation</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.moccupation"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Contact No.</label>
          <input type="text" class="form-control" readonly />
        </div>
      </div>

      <!-- Guardian's Details (if applicable) -->
      <div class="col-12">
        <h6>Guardian's Details (if not living with parents)</h6>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.guardian"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Relationship</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.grelationship"
          />
        </div>
      </div>
      <div class="col-12 col-sm-4">
        <div class="form-group">
          <label>Contact No.</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.gcontactno"
          />
        </div>
      </div>
    </div>

    <!-- Educational Background -->
    <div class="row">
      <div class="col-12">
        <h5 class="form-title"><span>Educational Background</span></h5>
      </div>
      <!-- Junior High School -->
      <div class="col-12">
        <h6>Junior High School</h6>
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-group">
          <label>School Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.secondaryschool"
          />
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-group">
          <label>Inclusive Dates</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.second_year"
          />
        </div>
      </div>

      <!-- Senior High School -->
      <div class="col-12">
        <h6>Senior High School</h6>
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-group">
          <label>School Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.shseduc"
          />
        </div>
      </div>
      <div class="col-12 col-sm-6">
        <div class="form-group">
          <label>Inclusive Dates</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.seniorHighSchoolDates"
          />
        </div>
      </div>

      <div class="col-12">
        <div class="form-group">
          <label>Track</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.shstrack"
          />
        </div>
      </div>

      <!-- College (if applicable) -->
      <div class="col-12">
        <h6>College (if applicable)</h6>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>College Name</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.tertiaryschool"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Inclusive Dates</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.tritiary_year"
          />
        </div>
      </div>
      <div class="col-12">
        <div class="form-group">
          <label>College Address</label>
          <input
            type="text"
            class="form-control"
            readonly
            v-model="studentinfo.tertiarycourse"
          />
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { useAuthStore } from "@/stores/authStore";
export default {
  data() {
    return {
      studentinfo: {
        studentno: "",
        entryyear: "",
        coursecode: "",
        major: "",
        yrlevel: "",
        status: "",
        surname: "",
        firstname: "",
        middlename: "",
        adress: "",
        birthday: "",
        birthplace: "",
        citizenship: "",
        religion: "",
        contactno: "",
        sex: "",
        fathername: "",
        foccupation: "",
        mothername: "",
        moccupation: "",
        guardian: "",
        grelationship: "",
        gadress: "",
        primaryschool: "",
        secondaryschool: "",
        tertiaryschool: "",
        tertiarycourse: "",
        NSO: "",
        TOR: "",
        nsat: "",
        transfer_credential: "",
        form: "",
        password: "",
        primary_year: "",
        second_year: "",
        tritiary_year: "",
        student_pic: "",
        availed: "",
        optout: "",
        voluntary: "",
        student_status: "",
        gcontactno: "",
        emailad: "",
        zipcode: "",
        payee: "",
        gmcc: "",
        lastdateviewedgrades: "",
        street: "",
        shseduc: "",
        shsgrad: "",
        tertiarydegree: "",
        tertiaryunits: "",
        shstrack: "",
        category: "",
        entrydate: "",
        civilstatus: "",
        lrn: "",
      },
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const authStore = useAuthStore();
      this.studentinfo = authStore.user[0];
      console.log(authStore.user[0]);
    },
  },
};
</script>
<style>
input[readonly] {
  background-color: white !important;
}
</style>
