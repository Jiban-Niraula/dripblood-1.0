import 'package:get/get.dart';

// Pages
import '../main.dart'; // LandingPage + AuthCheckPage
import '../Auth/LoginScreen.dart';
import '../Auth/RegisterScreen.dart';
import '../pages/home.dart';
import '../pages/reports.dart';
import '../pages/chats.dart';
import '../pages/settings.dart';
import '../pages/search.dart';

class AppRoutes {
  // ✅ NEW: Auth check route
  static const authCheck = '/auth-check';

  // Existing routes
  static const landing = '/';
  static const login = '/login';
  static const register = '/register';
  static const home = '/home';
  static const reports = '/reports';
  static const chats = '/chats';
  static const settings = '/settings';
  static const search = '/search';

  static final routes = [
    // ✅ ENTRY POINT
    GetPage(name: authCheck, page: () => const AuthCheckPage()),

    // Existing pages
    GetPage(name: landing, page: () => const LandingPage()),
    GetPage(name: login, page: () => const LoginPage()),
    GetPage(name: register, page: () => const RegisterScreen()),
    GetPage(name: home, page: () => const HomePage()),
    GetPage(name: reports, page: () => const ReportsPage()),
    GetPage(name: chats, page: () => const ChatPage()),
    GetPage(name: settings, page: () => const SettingsPage()),
    GetPage(name: search, page: () => const SearchDonorsPage()),
  ];
}
