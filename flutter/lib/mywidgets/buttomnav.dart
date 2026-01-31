import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../routes/app_routes.dart';
import '../pages/home.dart';
import '../pages/reports.dart';
import '../pages/chats.dart';
// import other pages if needed

class AppBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int)? onTap;

  const AppBottomNavigation({
    super.key,
    required this.currentIndex,
    this.onTap,
  });

  // List of routes corresponding to each BottomNavigationBarItem
  static const List<String> pages = [
    AppRoutes.home,
    AppRoutes.reports,
    AppRoutes.search,   // replace with actual route
    AppRoutes.chats,
    AppRoutes.settings, // replace with actual route
  ];

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      currentIndex: currentIndex,
      selectedItemColor: const Color(0xFFD32F2F),
      unselectedItemColor: Colors.grey,
      showUnselectedLabels: true,
      onTap: (index) {
        Get.toNamed(pages[index]);
        if (onTap != null) onTap!(index);
      },
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.assignment_outlined),
          activeIcon: Icon(Icons.assignment),
          label: 'Reports',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.location_on_outlined),
          activeIcon: Icon(Icons.location_on),
          label: 'Search',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_outlined),
          activeIcon: Icon(Icons.chat),
          label: 'Chat',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings_outlined),
          activeIcon: Icon(Icons.settings),
          label: 'Settings',
        ),
      ],
    );
  }
}
