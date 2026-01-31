import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../routes/app_routes.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailOrPhoneController = TextEditingController();
  final passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _isLoading = false;

  // Fixed colors
  static const Color kPrimaryRed = Color(0xFFD32F2F);
  static const Color kTextFieldBg = Color(0xFFF5F5F5);
  static const Color kTextGrey = Color(0xFF757575);
  static const Color kWhite = Colors.white;
  static const Color kBlack = Colors.black;

  Future<void> loginUser() async {
    final emailOrPhone = emailOrPhoneController.text.trim();
    final password = passwordController.text.trim();

    if (emailOrPhone.isEmpty || password.isEmpty) {
      Get.snackbar("Error", "Please enter email/phone and password");
      return;
    }

    setState(() => _isLoading = true);

    try {
      // Automatically choose URL based on platform
      final baseUrl = Platform.isAndroid
          ? "http://10.0.2.2:8000/api" // Emulator
          : "http://192.168.1.15:8000/api"; // Real device

      final response = await http.post(
        Uri.parse("$baseUrl/login"),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: jsonEncode({
          "email_or_phone": emailOrPhone,
          "password": password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success'] == true) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString("token", data['token']);

        Get.offAllNamed(AppRoutes.home);
      } else {
        Get.snackbar(
          "Login Failed",
          data['message'] ?? "Invalid credentials",
          backgroundColor: kPrimaryRed,
          colorText: kWhite,
        );
      }
    } catch (e) {
      Get.snackbar(
        "Error",
        "Could not connect to server",
        backgroundColor: kPrimaryRed,
        colorText: kWhite,
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    emailOrPhoneController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData prefixIcon,
    bool isPassword = false,
  }) {
    return TextField(
      controller: controller,
      obscureText: isPassword ? _obscurePassword : false,
      decoration: InputDecoration(
        prefixIcon: Icon(prefixIcon),
        hintText: hint,
        filled: true,
        fillColor: kTextFieldBg,
        suffixIcon: isPassword
            ? IconButton(
          icon: Icon(
            _obscurePassword ? Icons.visibility_off : Icons.visibility,
          ),
          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
        )
            : null,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kWhite,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Image.asset(
                  'assets/logo.png',
                  height: 300,
                  width: 300,
                ),
              ),

              const Text(
                "Welcome back",
                style: TextStyle(
                    fontSize: 22, fontWeight: FontWeight.bold, color: kBlack),
              ),
              const SizedBox(height: 8),
              const Text(
                "Sign in to continue",
                style: TextStyle(color: kTextGrey),
              ),
              const SizedBox(height: 28),

              _buildTextField(
                controller: emailOrPhoneController,
                hint: "Email or Phone",
                prefixIcon: Icons.person,
              ),
              const SizedBox(height: 16),
              _buildTextField(
                controller: passwordController,
                hint: "Password",
                prefixIcon: Icons.lock,
                isPassword: true,
              ),
              const SizedBox(height: 12),

              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () => Get.snackbar(
                      "Info", "Forgot password feature coming soon"),
                  child: const Text("Forgot password?"),
                ),
              ),
              const SizedBox(height: 12),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : loginUser,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: kPrimaryRed,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                    height: 22,
                    width: 22,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      color: kWhite,
                    ),
                  )
                      : const Text(
                    "Sign In",
                    style: TextStyle(fontSize: 16, color: kWhite),
                  ),
                ),
              ),

              const SizedBox(height: 30),
              Center(
                child: TextButton(
                  onPressed: () => Get.toNamed(AppRoutes.register),
                  child: const Text("Don’t have an account? Sign Up"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
