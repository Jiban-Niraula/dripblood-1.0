import 'dart:async';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dripblood/mywidgets/buttomnav.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  int _currentCarouselIndex = 0;
  final PageController _pageController = PageController(viewportFraction: 0.85);
  Timer? _carouselTimer;

  @override
  void initState() {
    super.initState();
    _startAutoSlide();
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startAutoSlide() {
    _carouselTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (_pageController.hasClients) {
        int nextPage = (_currentCarouselIndex + 1) % adImages.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  final List<Map<String, String>> adImages = const [
    {
      'url': 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800',
      'title': 'Save Lives Today'
    },
    {
      'url': 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800',
      'title': 'Every Drop Counts'
    },
    {
      'url': 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800',
      'title': 'Be a Hero'
    },
  ];

  void _onBottomNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        Get.offNamed('/home');
        break;
      case 1:
        Get.toNamed('/reports');
        break;
      case 2:
        Get.toNamed('/search');
        break;
      case 3:
        Get.toNamed('/chats');
        break;
      case 4:
        Get.toNamed('/settings');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: _buildAppBar(),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Enhanced Profile Section
            _buildEnhancedProfileSection(),

            // const SizedBox(height: 20),

            // Main Content Area
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [

                  // Quick Stats
                  _buildQuickStats(),

                  const SizedBox(height: 24),

                  // Section Header: Active Campaigns
                  _buildSectionHeader("Active Campaigns"),
                  const SizedBox(height: 12),
                  _buildCarouselAds(),

                  const SizedBox(height: 24),



                  // Section Header: Quick Actions
                  _buildSectionHeader("Quick Actions"),
                  const SizedBox(height: 12),
                  _buildQuickActions(),

                  const SizedBox(height: 24),

                  // Section Header: Discover
                  _buildSectionHeader("Discover"),
                  const SizedBox(height: 12),
                  _buildDiscoverSection(),

                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onBottomNavTap,
      ),
    );
  }

  // ===== APP BAR =====
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      automaticallyImplyLeading: false,
      elevation: 0,
      backgroundColor: Colors.red,
      title: Row(
        children: [
          Image.asset("assets/logo.png", height: 32),
          const SizedBox(width: 10),
          const Text(
            "DripBlood",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined, color: Colors.white),
          onPressed: () {},
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  // ===== ENHANCED PROFILE SECTION (WALLET STYLE) =====
  Widget _buildEnhancedProfileSection() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.red, Colors.red.shade700],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          // LEFT: Profile Picture
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const CircleAvatar(
              radius: 40,
              backgroundColor: Colors.white,
              child: Icon(Icons.person, color: Colors.red, size: 45),
            ),
          ),

          const SizedBox(width: 16),

          // RIGHT: Information
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Name
                const Text(
                  "Jiban Niraula",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(height: 6),

                // Blood Type
                Row(
                  children: const [
                    Icon(Icons.bloodtype, color: Colors.white, size: 16),
                    SizedBox(width: 6),
                    Text(
                      "O+ Blood Type",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 4),

                // Donor ID
                Row(
                  children: const [
                    Icon(Icons.badge, color: Colors.white70, size: 14),
                    SizedBox(width: 6),
                    Text(
                      "ID: 123456",
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 10),

                // Status Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.check_circle, color: Colors.white, size: 14),
                      SizedBox(width: 6),
                      Text(
                        "Eligible to Donate",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===== QUICK STATS =====
  Widget _buildQuickStats() {
    return Row(
      children: [
        _statCard("12", "Donations", Icons.favorite, Colors.red),
        const SizedBox(width: 12),
        _statCard("5", "Lives Saved", Icons.health_and_safety, Colors.green),
        const SizedBox(width: 12),
        _statCard("120", "Points", Icons.stars, Colors.amber),
      ],
    );
  }

  Widget _statCard(String value, String label, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 10),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===== SECTION HEADER =====
  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
      ),
    );
  }

  // ===== QUICK ACTIONS =====
  Widget _buildQuickActions() {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _actionButton(Icons.bloodtype, "Donate Blood", Colors.red),
            _actionButton(Icons.local_hospital, "Find Hospitals", Colors.blue),
            _actionButton(Icons.history, "My History", Colors.purple),
            _actionButton(Icons.share, "Share App", Colors.orange),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _actionButton(Icons.emergency, "Emergency", Colors.redAccent),
            _actionButton(Icons.event, "Campaigns", Colors.teal),
            _actionButton(Icons.group, "Community", Colors.indigo),
            _actionButton(Icons.volunteer_activism, "Volunteer", Colors.pink),
          ],
        ),
      ],
    );
  }

  Widget _actionButton(IconData icon, String label, Color color) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 4),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  // ===== CAROUSEL ADS =====
  Widget _buildCarouselAds() {
    return SizedBox(
      height: 180,
      child: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: adImages.length,
            onPageChanged: (index) {
              setState(() {
                _currentCarouselIndex = index;
              });
            },
            itemBuilder: (context, index) {
              final ad = adImages[index];
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 6),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  image: DecorationImage(
                    image: NetworkImage(ad['url']!),
                    fit: BoxFit.cover,
                  ),
                ),
                alignment: Alignment.bottomLeft,
                padding: const EdgeInsets.all(16),
                child: Text(
                  ad['title']!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    shadows: [
                      Shadow(
                        color: Colors.black54,
                        blurRadius: 8,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          // Dots Indicator
          Positioned(
            bottom: 12,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(adImages.length, (index) {
                return AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _currentCarouselIndex == index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _currentCarouselIndex == index
                        ? Colors.white
                        : Colors.white.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  // ===== DISCOVER SECTION =====
  Widget _buildDiscoverSection() {
    return Row(
      children: [
        _discoverCard(Icons.location_on, "Nearby Centers", Colors.teal),
        const SizedBox(width: 12),
        _discoverCard(Icons.star, "Achievements", Colors.amber),
        const SizedBox(width: 12),
        _discoverCard(Icons.info_outline, "Tips & Info", Colors.indigo),
      ],
    );
  }

  Widget _discoverCard(IconData icon, String label, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}