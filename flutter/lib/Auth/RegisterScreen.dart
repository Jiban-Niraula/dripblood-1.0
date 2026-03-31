import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int currentStep = 0;

  // Controllers
  final fullName = TextEditingController();
  final email = TextEditingController();
  final phone = TextEditingController();
  final streetAddress = TextEditingController();
  final city = TextEditingController();
  final stateProvince = TextEditingController();
  final zipCode = TextEditingController();
  final country = TextEditingController();
  final otp = TextEditingController();
  final password = TextEditingController();
  final confirmPassword = TextEditingController();

  DateTime? dob;
  String bloodType = 'A+';
  final bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  String gender = 'male';
  final genders = ['male', 'female', 'other'];

  File? profileImage;
  String? profileImageBase64;

  bool obscure = true;

  // Validation errors
  String fullNameError = '';
  String emailError = '';
  String phoneError = '';
  String streetAddressError = '';
  String dobError = '';
  String otpError = '';
  String passwordError = '';
  String confirmPasswordError = '';
  String imageError = '';

  // Backend
  final String baseUrl = "http://10.0.2.2:8000/api"; // Android emulator
  String? cacheKey;
  String? otpFromBackend; // For testing

  // Brand color
  final Color brandColor = const Color(0xFFD32F2F);

  @override
  void dispose() {
    fullName.dispose();
    email.dispose();
    phone.dispose();
    streetAddress.dispose();
    city.dispose();
    stateProvince.dispose();
    zipCode.dispose();
    country.dispose();
    otp.dispose();
    password.dispose();
    confirmPassword.dispose();
    super.dispose();
  }

  // ---------------- Helper ----------------
  String? formatDob(DateTime? date) {
    if (date == null) return null;
    final y = date.year.toString().padLeft(4, '0');
    final m = date.month.toString().padLeft(2, '0');
    final d = date.day.toString().padLeft(2, '0');
    return "$y-$m-$d"; // YYYY-MM-DD
  }

  // ---------------- Validation ----------------
  bool validateStep1() {
    setState(() {
      fullNameError = fullName.text.trim().isEmpty ? "Full name required" : "";
      emailError = !GetUtils.isEmail(email.text.trim()) ? "Invalid email" : "";
      phoneError = phone.text.trim().length < 10 ? "Invalid phone" : "";
      streetAddressError = streetAddress.text.trim().isEmpty ? "Street address required" : "";
    });
    return fullNameError.isEmpty &&
        emailError.isEmpty &&
        phoneError.isEmpty &&
        streetAddressError.isEmpty;
  }

  bool validateStep2() {
    // DOB and Gender are optional, so just return true
    return true;
  }

  bool validateStep3() {
    if (otp.text.trim().length != 4) {
      setState(() => otpError = "Invalid OTP (4 digits required)");
      return false;
    } else {
      setState(() => otpError = '');
      return true;
    }
  }

  bool validateStep4() {
    bool valid = true;
    if (password.text.trim().isEmpty || password.text.trim().length < 6) {
      setState(() => passwordError = "Password required (min 6 characters)");
      valid = false;
    } else {
      setState(() => passwordError = '');
    }
    if (confirmPassword.text.trim().isEmpty || confirmPassword.text != password.text) {
      setState(() => confirmPasswordError = "Passwords do not match");
      valid = false;
    } else {
      setState(() => confirmPasswordError = '');
    }
    return valid;
  }

  InputDecoration inputStyle(String hint, IconData icon, String error) {
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, color: brandColor),
      filled: true,
      fillColor: Colors.grey.shade100,
      errorText: error.isEmpty ? null : error,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide.none,
      ),
    );
  }

  // ---------------- Image Picker ----------------
  Future<void> pickProfileImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? pickedFile =
    await picker.pickImage(source: ImageSource.gallery, imageQuality: 70);

    if (pickedFile != null) {
      setState(() {
        profileImage = File(pickedFile.path);
        imageError = '';
      });
      final bytes = await profileImage!.readAsBytes();
      profileImageBase64 = base64Encode(bytes);
    }
  }

  // ---------------- API Calls ----------------
  Future<void> registerStep1Api() async {
    if (!validateStep1()) return;

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/register"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "full_name": fullName.text.trim(),
          "email": email.text.trim(),
          "phone": phone.text.trim(),
          "street_address": streetAddress.text.trim(),
          "city": city.text.trim().isEmpty ? null : city.text.trim(),
          "state_province": stateProvince.text.trim().isEmpty ? null : stateProvince.text.trim(),
          "zip_code": zipCode.text.trim().isEmpty ? null : zipCode.text.trim(),
          "country": country.text.trim().isEmpty ? null : country.text.trim(),
          "blood_type": bloodType,
          "dob": formatDob(dob),
          "gender": gender,
          "profile_image": profileImageBase64,
        }),
      );

      Map<String, dynamic> data = {};
      try {
        data = jsonDecode(response.body);
      } catch (_) {}

      if (response.statusCode == 200) {
        cacheKey = data['cache_key'];
        otpFromBackend = data['otp']?.toString(); // For testing

        Get.snackbar(
          "Success",
          "${data['message']}\n${otpFromBackend != null ? 'OTP: $otpFromBackend' : ''}",
          backgroundColor: brandColor,
          colorText: Colors.white,
          duration: const Duration(seconds: 5),
        );
        setState(() => currentStep = 1);
      } else {
        // Handle validation errors
        if (data['errors'] != null) {
          final errors = data['errors'] as Map<String, dynamic>;
          String errorMessage = errors.values.first[0];
          Get.snackbar(
            "Validation Error",
            errorMessage,
            backgroundColor: Colors.red,
            colorText: Colors.white,
          );
        } else {
          Get.snackbar(
            "Error",
            data['message'] ?? "Server error",
            backgroundColor: Colors.red,
            colorText: Colors.white,
          );
        }
      }
    } catch (e) {
      Get.snackbar(
          "Error",
          "Server not reachable: $e",
          backgroundColor: Colors.red,
          colorText: Colors.white
      );
    }
  }

  void nextStep2() {
    if (validateStep2()) setState(() => currentStep = 2);
  }

  void nextToOtp() {
    // Move to OTP step
    setState(() => currentStep = 2);
  }

  Future<void> completeRegistrationApi() async {
    if (!validateStep3() || !validateStep4() || cacheKey == null) return;

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/complete-registration"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "cache_key": cacheKey,
          "otp": otp.text.trim(),
          "password": password.text.trim(),
          "password_confirmation": confirmPassword.text.trim(),
        }),
      );

      Map<String, dynamic> data = {};
      try {
        data = jsonDecode(response.body);
      } catch (_) {}

      if (response.statusCode == 200 || response.statusCode == 201) {
        Get.snackbar(
            "Success",
            data['message'] ?? "Registered successfully",
            backgroundColor: brandColor,
            colorText: Colors.white
        );
        Get.offAllNamed("/login");
      } else {
        // Handle validation errors
        if (data['errors'] != null) {
          final errors = data['errors'] as Map<String, dynamic>;
          String errorMessage = errors.values.first[0];
          Get.snackbar(
            "Validation Error",
            errorMessage,
            backgroundColor: Colors.red,
            colorText: Colors.white,
          );
        } else {
          Get.snackbar(
            "Error",
            data['message'] ?? "Server error",
            backgroundColor: Colors.red,
            colorText: Colors.white,
          );
        }
      }
    } catch (e) {
      Get.snackbar(
          "Error",
          "Server not reachable: $e",
          backgroundColor: Colors.red,
          colorText: Colors.white
      );
    }
  }

  // ---------------- Steps ----------------
  Widget step1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Personal Information",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),

        // Full Name (Required)
        TextField(
          controller: fullName,
          decoration: inputStyle("Full Name *", Icons.person, fullNameError),
        ),
        const SizedBox(height: 12),

        // Email (Required)
        TextField(
          controller: email,
          keyboardType: TextInputType.emailAddress,
          decoration: inputStyle("Email *", Icons.email, emailError),
        ),
        const SizedBox(height: 12),

        // Phone (Required)
        TextField(
          controller: phone,
          keyboardType: TextInputType.phone,
          decoration: inputStyle("Phone *", Icons.phone, phoneError),
        ),
        const SizedBox(height: 12),

        // Street Address (Required)
        TextField(
          controller: streetAddress,
          decoration: inputStyle("Street Address *", Icons.location_on, streetAddressError),
        ),
        const SizedBox(height: 12),

        // City (Optional)
        TextField(
          controller: city,
          decoration: inputStyle("City", Icons.location_city, ""),
        ),
        const SizedBox(height: 12),

        // State/Province (Optional)
        TextField(
          controller: stateProvince,
          decoration: inputStyle("State/Province", Icons.map, ""),
        ),
        const SizedBox(height: 12),

        // Zip Code (Optional)
        TextField(
          controller: zipCode,
          decoration: inputStyle("Zip Code", Icons.pin, ""),
        ),
        const SizedBox(height: 12),

        // Country (Optional)
        TextField(
          controller: country,
          decoration: inputStyle("Country", Icons.flag, ""),
        ),
        const SizedBox(height: 12),

        // Blood Type Dropdown (Required)
        DropdownButtonFormField(
          value: bloodType,
          items: bloodTypes.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
          onChanged: (v) => setState(() => bloodType = v!),
          decoration: inputStyle("Blood Type *", Icons.bloodtype, ""),
        ),
        const SizedBox(height: 12),

        // Profile Image (Optional)
        GestureDetector(
          onTap: pickProfileImage,
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                Icon(Icons.image, color: brandColor),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    profileImage == null
                        ? "Select Profile Picture (Optional)"
                        : "Image Selected: ${profileImage!.path.split('/').last}",
                  ),
                ),
              ],
            ),
          ),
        ),
        if (imageError.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(imageError, style: const TextStyle(color: Colors.red)),
          ),
        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: registerStep1Api,
            style: ElevatedButton.styleFrom(
              backgroundColor: brandColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text(
              "Send OTP",
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget step2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Additional Information",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),

        // Date of Birth (Optional)
        GestureDetector(
          onTap: () async {
            dob = await showDatePicker(
              context: context,
              initialDate: DateTime(2005),
              firstDate: DateTime(1950),
              lastDate: DateTime.now(),
            );
            setState(() {});
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              children: [
                Icon(Icons.calendar_today, color: brandColor),
                const SizedBox(width: 12),
                Text(dob == null ? "Select Date of Birth (Optional)" : formatDob(dob)!),
              ],
            ),
          ),
        ),
        if (dobError.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 6),
            child: Text(dobError, style: const TextStyle(color: Colors.red)),
          ),
        const SizedBox(height: 12),

        // Gender Dropdown (Optional)
        DropdownButtonFormField(
          value: gender,
          items: genders.map((e) => DropdownMenuItem(
            value: e,
            child: Text(e[0].toUpperCase() + e.substring(1)),
          )).toList(),
          onChanged: (v) => setState(() => gender = v!),
          decoration: inputStyle("Gender (Optional)", Icons.person_outline, ""),
        ),
        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: nextToOtp,
            style: ElevatedButton.styleFrom(
              backgroundColor: brandColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text(
              "Next",
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget step3() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Verify & Set Password",
          style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),

        // OTP Field
        TextField(
          controller: otp,
          keyboardType: TextInputType.number,
          maxLength: 4,
          decoration: inputStyle("Enter OTP (4 digits)", Icons.lock, otpError),
        ),
        const SizedBox(height: 12),

        // Password Field
        TextField(
          controller: password,
          obscureText: obscure,
          decoration: inputStyle("Password (min 6 characters)", Icons.lock, passwordError).copyWith(
            suffixIcon: IconButton(
              icon: Icon(obscure ? Icons.visibility : Icons.visibility_off),
              onPressed: () => setState(() => obscure = !obscure),
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Confirm Password Field
        TextField(
          controller: confirmPassword,
          obscureText: obscure,
          decoration: inputStyle("Confirm Password", Icons.lock_outline, confirmPasswordError),
        ),
        const SizedBox(height: 24),

        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: completeRegistrationApi,
            style: ElevatedButton.styleFrom(
              backgroundColor: brandColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            child: const Text(
              "Complete Registration",
              style: TextStyle(fontSize: 16, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final steps = [step1(), step2(), step3()];
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: brandColor,
        elevation: 0,
        leading: currentStep > 0
            ? IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => setState(() => currentStep--),
        )
            : null,
        title: const Text(
          "Register",
          style: TextStyle(color: Color(0xFFD32F2F)),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: steps[currentStep],
        ),
      ),
    );
  }
}