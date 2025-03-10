<template>
  <form @submit.prevent="addStudent" class="space-y-6">
    <!-- Admission Info -->
    <div>
      <h5 class="text-xl font-semibold border-b pb-2">Admission Info</h5>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Student ID</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.studentno"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Course</label>
          <input
            type="text"
            readonly
            v-model="studentinfo.coursecode"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Major</label>
          <input
            type="text"
            readonly
            v-model="studentinfo.major"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
    </div>

    <!-- Personal Info -->
    <div>
      <h5 class="text-xl font-semibold border-b pb-2">Personal Info</h5>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Last Name</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.surname"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >First Name</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.firstname"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Middle Name</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.middlename"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div class="sm:col-span-1">
          <label class="block text-sm font-medium text-gray-700"
            >Date of Birth</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.birthday"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Place of Birth</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.birthplace"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Sex</label>
          <input
            type="text"
            readonly
            v-model="studentinfo.sex"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Civil Status</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.civilstatus"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Religion</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.religion"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Citizenship</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.citizenship"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Contact No.</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.contactno"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Email Address</label
          >
          <input
            type="email"
            readonly
            v-model="studentinfo.emailad"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700"
            >Street/House No./Prk.</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.street"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Postal Code</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.zipcode"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700"
          >Permanent Address</label
        >
        <input
          type="text"
          readonly
          v-model="studentinfo.adress"
          class="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </div>
    </div>

    <!-- Family Background -->
    <div>
      <h5 class="text-xl font-semibold border-b pb-2">Family Background</h5>
      <!-- Father's Details -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">Father's Details</h6>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              readonly
              v-model="studentinfo.fathername"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Occupation</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.foccupation"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact No.</label
            >
            <input
              type="text"
              readonly
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
      </div>
      <!-- Mother's Details -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">Mother's Details</h6>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              readonly
              v-model="studentinfo.mothername"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Occupation</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.moccupation"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact No.</label
            >
            <input
              type="text"
              readonly
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
      </div>
      <!-- Guardian's Details -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">
          Guardian's Details (if not living with parents)
        </h6>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              readonly
              v-model="studentinfo.guardian"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Relationship</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.grelationship"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Contact No.</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.gcontactno"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Educational Background -->
    <div>
      <h5 class="text-xl font-semibold border-b pb-2">
        Educational Background
      </h5>
      <!-- Junior High School -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">Junior High School</h6>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >School Name</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.secondaryschool"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Inclusive Dates</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.second_year"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
      </div>
      <!-- Senior High School -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">Senior High School</h6>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >School Name</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.shseduc"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Inclusive Dates</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.seniorHighSchoolDates"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Track</label>
          <input
            type="text"
            readonly
            v-model="studentinfo.shstrack"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
      <!-- College (if applicable) -->
      <div class="mt-4">
        <h6 class="text-lg font-medium">College (if applicable)</h6>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >College Name</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.tertiaryschool"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Inclusive Dates</label
            >
            <input
              type="text"
              readonly
              v-model="studentinfo.tritiary_year"
              class="mt-1 block w-full border border-gray-300 rounded p-2"
            />
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700"
            >College Address</label
          >
          <input
            type="text"
            readonly
            v-model="studentinfo.tertiarycourse"
            class="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { getStudentById } from "@/services/profileServices";

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
      this.studentinfo = authStore.user;
    },
  },
};
</script>

<style>
/* With Tailwind handling the styling, additional styles are minimal */
</style>
