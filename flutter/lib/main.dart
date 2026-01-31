import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'routes/app_routes.dart';

void main() {
  runApp(const DripBloodApp());
}

class DripBloodApp extends StatelessWidget {
  const DripBloodApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'DripBlood',
      debugShowCheckedModeBanner: false,

      // 🌗 System theme
      themeMode: ThemeMode.system,

      // ☀️ Light theme
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: Colors.white,
        primaryColor: const Color(0xFFD32F2F),
      ),

      // 🌙 Dark theme
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF121212),
        primaryColor: const Color(0xFFD32F2F),
      ),

      // ✅ AUTH CHECK IS ENTRY POINT
      initialRoute: AppRoutes.authCheck,
      getPages: AppRoutes.routes,
    );
  }
}

////////////////////////////////////////////////////////////
/// AUTH CHECK PAGE
////////////////////////////////////////////////////////////

class AuthCheckPage extends StatefulWidget {
  const AuthCheckPage({super.key});

  @override
  State<AuthCheckPage> createState() => _AuthCheckPageState();
}

class _AuthCheckPageState extends State<AuthCheckPage> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    await Future.delayed(const Duration(seconds: 1));

    if (token != null && token.isNotEmpty) {
      Get.offAllNamed(AppRoutes.home);
    } else {
      Get.offAllNamed(AppRoutes.landing);
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}

////////////////////////////////////////////////////////////
/// LANDING PAGE (WITH OAUTH BUTTONS)
////////////////////////////////////////////////////////////

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  State<LandingPage> createState() => _LandingPageState();
}

class _LandingPageState extends State<LandingPage>
    with SingleTickerProviderStateMixin {
  late final AnimationController _logoController;
  late final Animation<double> _logoAnimation;

  @override
  void initState() {
    super.initState();

    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _logoAnimation = Tween<double>(begin: 0.95, end: 1.05).animate(
      CurvedAnimation(parent: _logoController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _logoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28),
          child: Column(
            children: [
              const Spacer(),

              ScaleTransition(
                scale: _logoAnimation,
                child: Image.asset(
                  'assets/logo.png',
                  width: 320,
                  height: 320,
                ),
              ),

              const Text(
                'DripBlood',
                style: TextStyle(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFFD32F2F),
                ),
              ),

              const SizedBox(height: 8),

              const Text(
                'Connecting Lives, One Drop at a Time',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.black54,
                ),
              ),

              const Spacer(),

              // ✅ SIGN UP
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () => Get.toNamed(AppRoutes.register),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD32F2F),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Sign Up',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                ),
              ),

              const SizedBox(height: 16),

              // ✅ SIGN IN
              SizedBox(
                width: double.infinity,
                height: 56,
                child: OutlinedButton(
                  onPressed: () => Get.toNamed(AppRoutes.login),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFD32F2F)),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: const Text(
                    'Sign In',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFD32F2F),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // ✅ Divider
              Row(
                children: const [
                  Expanded(child: Divider(color: Colors.black26)),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'Or continue with',
                      style: TextStyle(color: Colors.black54),
                    ),
                  ),
                  Expanded(child: Divider(color: Colors.black26)),
                ],
              ),

              const SizedBox(height: 24),

              // ✅ OAUTH BUTTONS
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _oauthButton(
                    icon: Icons.g_mobiledata_rounded,
                    color: Colors.red,
                    label: 'Google',
                  ),
                  const SizedBox(width: 16),
                  _oauthButton(
                    icon: Icons.facebook_rounded,
                    color: Color(0xFF1877F2),
                    label: 'Facebook',
                  ),
                  const SizedBox(width: 16),
                  _oauthButton(
                    icon: Icons.email,
                    color: Color(0xFF00A4EF),
                    label: 'Microsoft',
                  ),
                ],
              ),

              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _oauthButton({
    required IconData icon,
    required Color color,
    required String label,
  }) {
    return GestureDetector(
      onTap: () {
        Get.snackbar(label, '$label login coming soon');
      },
      child: Container(
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Center(
          child: Icon(icon, size: 32, color: color),
        ),
      ),
    );
  }
}
