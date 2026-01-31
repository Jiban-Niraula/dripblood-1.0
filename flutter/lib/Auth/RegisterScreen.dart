import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int currentStep = 0;

  // Controllers
  final name = TextEditingController();
  final email = TextEditingController();
  final phone = TextEditingController();
  final address = TextEditingController();
  final otp = TextEditingController();
  final password = TextEditingController();
  final confirmPassword = TextEditingController();

  DateTime? dob;
  String bloodGroup = 'A+';
  final bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  bool obscure = true;

  // Validation errors
  String nameError = '';
  String emailError = '';
  String phoneError = '';
  String addressError = '';
  String dobError = '';
  String otpError = '';
  String passwordError = '';
  String confirmPasswordError = '';

  // Backend
  final String baseUrl = "http://10.0.2.2:8000/api"; // Android emulator
  String? cacheKey;

  // Brand color
  final Color brandColor = const Color(0xFFD32F2F);

  @override
  void dispose() {
    name.dispose();
    email.dispose();
    phone.dispose();
    address.dispose();
    otp.dispose();
    password.dispose();
    confirmPassword.dispose();
    super.dispose();
  }

  // ---------------- Validation ----------------
  bool validateStep1() {
    setState(() {
      nameError = name.text.trim().isEmpty ? "Name required" : "";
      emailError = !GetUtils.isEmail(email.text.trim()) ? "Invalid email" : "";
      phoneError = phone.text.trim().length < 10 ? "Invalid phone" : "";
      addressError = address.text.trim().isEmpty ? "Address required" : "";
    });
    return nameError.isEmpty && emailError.isEmpty && phoneError.isEmpty && addressError.isEmpty;
  }

  bool validateStep2() {
    if (dob == null) {
      setState(() => dobError = "Select DOB");
      return false;
    } else {
      setState(() => dobError = '');
      return true;
    }
  }

  bool validateStep3() {
    if (otp.text.trim().length < 4) {
      setState(() => otpError = "Invalid OTP");
      return false;
    } else {
      setState(() => otpError = '');
      return true;
    }
  }

  bool validateStep4() {
    bool valid = true;
    if (password.text.trim().isEmpty) {
      setState(() => passwordError = "Password required");
      valid = false;
    } else {
      setState(() => passwordError = '');
    }
    if (confirmPassword.text.trim().isEmpty || confirmPassword.text != password.text) {
      setState(() => confirmPasswordError = "Confirm password does not match");
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

  // ---------------- API Calls ----------------

  // Step 1: Register (save in cache + send OTP)
  Future<void> registerStep1Api() async {
    if (!validateStep1()) return;

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/register"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "name": name.text.trim(),
          "email": email.text.trim(),
          "phone": phone.text.trim(),
          "address": address.text.trim(),
          "blood_group": bloodGroup,
        }),
      );

      Map<String, dynamic> data = {};
      try {
        data = jsonDecode(response.body);
      } catch (_) {}

      if (response.statusCode == 200) {
        cacheKey = data['cache_key'];
        Get.snackbar("Success", data['message'], backgroundColor: brandColor, colorText: Colors.white);
        setState(() => currentStep = 1);
      } else {
        Get.snackbar("Error", data['message'] ?? "Server error", backgroundColor: Colors.red, colorText: Colors.white);
      }
    } catch (e) {
      Get.snackbar("Error", "Server not reachable", backgroundColor: Colors.red, colorText: Colors.white);
    }
  }

  // Step 2: DOB page just local validation
  void nextStep2() {
    if (validateStep2()) setState(() => currentStep = 2);
  }

  // Step 3: Verify OTP
  Future<void> verifyOtpApi() async {
    if (!validateStep3() || cacheKey == null) return;

    Get.snackbar("Info", "OTP verified locally, proceed to password", backgroundColor: brandColor, colorText: Colors.white);
    setState(() => currentStep = 3);
  }

  // Step 4: Complete registration
  Future<void> completeRegistrationApi() async {
    if (!validateStep4() || cacheKey == null) return;

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/complete-registration"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "cache_key": cacheKey,
          "otp": otp.text.trim(),
          "password": password.text.trim(),
          "password_confirmation": confirmPassword.text.trim(),
          "dob": dob?.toIso8601String(),
        }),
      );

      Map<String, dynamic> data = {};
      try {
        data = jsonDecode(response.body);
      } catch (_) {}

      if (response.statusCode == 200 || response.statusCode == 201) {
        Get.snackbar("Success", data['message'] ?? "Registered successfully", backgroundColor: brandColor, colorText: Colors.white);
        Get.offAllNamed("/login");
      } else {
        Get.snackbar("Error", data['message'] ?? "Server error", backgroundColor: Colors.red, colorText: Colors.white);
      }
    } catch (e) {
      Get.snackbar("Error", "Server not reachable", backgroundColor: Colors.red, colorText: Colors.white);
    }
  }

  // ---------------- Steps ----------------
  Widget step1() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Personal Information", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        TextField(controller: name, decoration: inputStyle("Full Name", Icons.person, nameError)),
        const SizedBox(height: 12),
        TextField(controller: email, decoration: inputStyle("Email", Icons.email, emailError)),
        const SizedBox(height: 12),
        TextField(controller: phone, keyboardType: TextInputType.phone, decoration: inputStyle("Phone", Icons.phone, phoneError)),
        const SizedBox(height: 12),
        TextField(controller: address, decoration: inputStyle("Address", Icons.location_on, addressError)),
        const SizedBox(height: 12),
        DropdownButtonFormField(
          value: bloodGroup,
          items: bloodGroups.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
          onChanged: (v) => setState(() => bloodGroup = v!),
          decoration: inputStyle("Blood Group", Icons.bloodtype, ""),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: registerStep1Api,
            style: ElevatedButton.styleFrom(backgroundColor: brandColor, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
            child: const Text("Next", style: TextStyle(fontSize: 16,color: Colors.white)),
          ),
        ),
      ],
    );
  }

  Widget step2() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Date of Birth", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        GestureDetector(
          onTap: () async {
            dob = await showDatePicker(context: context, initialDate: DateTime(2005), firstDate: DateTime(1950), lastDate: DateTime.now());
            setState(() {});
          },
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(14)),
            child: Row(
              children: [
                Icon(Icons.calendar_today, color: brandColor),
                const SizedBox(width: 12),
                Text(dob == null ? "Select DOB" : "${dob!.year}-${dob!.month}-${dob!.day}"),
              ],
            ),
          ),
        ),
        if (dobError.isNotEmpty)
          Padding(padding: const EdgeInsets.only(top: 6), child: Text(dobError, style: const TextStyle(color: Colors.red))),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: nextStep2,
            style: ElevatedButton.styleFrom(backgroundColor: brandColor, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
            child: const Text("Next", style: TextStyle(fontSize: 16,color: Colors.white)),
          ),
        ),
      ],
    );
  }

  Widget step3() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("OTP Verification", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        TextField(controller: otp, keyboardType: TextInputType.number, decoration: inputStyle("Enter OTP", Icons.lock, otpError)),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: verifyOtpApi,
            style: ElevatedButton.styleFrom(backgroundColor: brandColor, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
            child: const Text("Verify OTP", style: TextStyle(fontSize: 16,color: Colors.white)),
          ),
        ),
      ],
    );
  }

  Widget step4() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Set Password", style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 20),
        TextField(controller: password, obscureText: obscure, decoration: inputStyle("Password", Icons.lock, passwordError)),
        const SizedBox(height: 12),
        TextField(controller: confirmPassword, obscureText: obscure, decoration: inputStyle("Confirm Password", Icons.lock_outline, confirmPasswordError)),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton(
            onPressed: completeRegistrationApi,
            style: ElevatedButton.styleFrom(backgroundColor: brandColor, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
            child: const Text("Register", style: TextStyle(fontSize: 16,color: Colors.white)),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final steps = [step1(), step2(), step3(), step4()];
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        foregroundColor: brandColor,
        elevation: 0,
        leading: currentStep > 0
            ? IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => setState(() => currentStep--))
            : null,
        title: const Text("Register", style: TextStyle(color: Color(0xFFD32F2F))),
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
