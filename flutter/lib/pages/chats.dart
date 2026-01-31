import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dripblood/mywidgets/buttomnav.dart';

class ChatPage extends StatefulWidget {
  const ChatPage({super.key});

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  int _currentIndex = 3;
  final TextEditingController _searchController = TextEditingController();
  bool _isSearching = false;
  String _searchQuery = '';

  // Available entities (shown at top like Facebook Messenger)
  final List<Map<String, dynamic>> availableEntities = [
    {
      'name': 'City General',
      'type': 'Blood Bank',
      'isOnline': true,
      'avatar': Icons.local_hospital,
      'color': Colors.red,
    },
    {
      'name': 'Red Cross',
      'type': 'Agency',
      'isOnline': true,
      'avatar': Icons.favorite,
      'color': Colors.pink,
    },
    {
      'name': 'Central Hospital',
      'type': 'Hospital',
      'isOnline': true,
      'avatar': Icons.local_hospital,
      'color': Colors.blue,
    },
    {
      'name': 'Health Agency',
      'type': 'Agency',
      'isOnline': true,
      'avatar': Icons.business,
      'color': Colors.orange,
    },
    {
      'name': 'Sarah Johnson',
      'type': 'Donor',
      'isOnline': true,
      'avatar': Icons.person,
      'color': Colors.purple,
    },
    {
      'name': 'Metro Blood',
      'type': 'Blood Bank',
      'isOnline': true,
      'avatar': Icons.bloodtype,
      'color': Colors.red,
    },
  ];

  // All conversations (Donors, Blood Banks, Hospitals, Agencies)
  final List<Map<String, dynamic>> allChats = [
    {
      'name': 'City General Blood Bank',
      'type': 'Blood Bank',
      'lastMessage': 'Thank you for your donation!',
      'time': '10:30 AM',
      'unreadCount': 2,
      'isOnline': true,
      'avatar': Icons.local_hospital,
      'color': Colors.red,
    },
    {
      'name': 'Red Cross Blood Center',
      'type': 'Blood Bank',
      'lastMessage': 'Your next eligible donation date is...',
      'time': 'Yesterday',
      'unreadCount': 0,
      'isOnline': true,
      'avatar': Icons.favorite,
      'color': Colors.red,
    },
    {
      'name': 'National Blood Donation Agency',
      'type': 'Agency',
      'lastMessage': 'New campaign starting next week',
      'time': '2 days ago',
      'unreadCount': 5,
      'isOnline': false,
      'avatar': Icons.business,
      'color': Colors.orange,
    },
    {
      'name': 'Sarah Johnson',
      'type': 'Donor',
      'lastMessage': 'Thanks for connecting!',
      'time': '11:45 AM',
      'unreadCount': 0,
      'isOnline': true,
      'avatar': Icons.person,
      'color': Colors.purple,
    },
    {
      'name': 'Michael Chen',
      'type': 'Donor',
      'lastMessage': 'See you at the next drive',
      'time': 'Yesterday',
      'unreadCount': 1,
      'isOnline': false,
      'avatar': Icons.person,
      'color': Colors.purple,
    },
    {
      'name': 'Central Hospital',
      'type': 'Hospital',
      'lastMessage': 'Emergency blood needed for surgery',
      'time': '2 hours ago',
      'unreadCount': 3,
      'isOnline': true,
      'avatar': Icons.local_hospital,
      'color': Colors.blue,
    },
    {
      'name': 'Metro Medical Center',
      'type': 'Hospital',
      'lastMessage': 'Blood inventory update available',
      'time': '3 days ago',
      'unreadCount': 0,
      'isOnline': true,
      'avatar': Icons.local_hospital,
      'color': Colors.blue,
    },
    {
      'name': 'Health Ministry Agency',
      'type': 'Agency',
      'lastMessage': 'Register for the blood drive',
      'time': '1 week ago',
      'unreadCount': 0,
      'isOnline': false,
      'avatar': Icons.account_balance,
      'color': Colors.orange,
    },
    {
      'name': 'Emily Davis',
      'type': 'Donor',
      'lastMessage': 'When is the next donation camp?',
      'time': '5 hours ago',
      'unreadCount': 0,
      'isOnline': true,
      'avatar': Icons.person,
      'color': Colors.purple,
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

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

  void _openChat(Map<String, dynamic> chat) {
    Get.snackbar(
      'Opening Chat',
      'Chat with ${chat['name']}',
      backgroundColor: Colors.red.shade100,
      colorText: Colors.red.shade900,
      icon: Icon(chat['avatar'], color: Colors.red),
      snackPosition: SnackPosition.BOTTOM,
      margin: const EdgeInsets.all(16),
      borderRadius: 12,
      duration: const Duration(seconds: 2),
    );
  }

  List<Map<String, dynamic>> _getFilteredChats() {
    if (_searchQuery.isEmpty) return allChats;
    return allChats.where((chat) {
      return chat['name'].toLowerCase().contains(_searchQuery.toLowerCase()) ||
          chat['lastMessage'].toLowerCase().contains(
            _searchQuery.toLowerCase(),
          ) ||
          chat['type'].toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.white,
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                style: const TextStyle(color: Colors.black87, fontSize: 16),
                decoration: InputDecoration(
                  hintText: 'Search messages...',
                  hintStyle: TextStyle(
                    color: Colors.grey.shade400,
                    fontSize: 16,
                  ),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.zero,
                ),
                onChanged: (value) {
                  setState(() => _searchQuery = value);
                },
              )
            : const Text(
                'Messages',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                  letterSpacing: -0.5,
                ),
              ),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 8),
            child: IconButton(
              icon: Icon(
                _isSearching ? Icons.close_rounded : Icons.search_rounded,
                color: Colors.black87,
                size: 24,
              ),
              onPressed: () {
                setState(() {
                  _isSearching = !_isSearching;
                  if (!_isSearching) {
                    _searchController.clear();
                    _searchQuery = '';
                  }
                });
              },
              style: IconButton.styleFrom(
                backgroundColor: Colors.grey.shade100,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.only(right: 12),
            child: PopupMenuButton<String>(
              icon: Icon(
                Icons.more_vert_rounded,
                color: Colors.black87,
                size: 24,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              offset: const Offset(0, 50),
              onSelected: (value) {
                switch (value) {
                  case 'archived':
                    Get.snackbar(
                      'Archived',
                      'View archived conversations',
                      snackPosition: SnackPosition.BOTTOM,
                    );
                    break;
                  case 'settings':
                    Get.toNamed('/settings');
                    break;
                }
              },
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'archived',
                  child: Row(
                    children: [
                      Icon(
                        Icons.archive_rounded,
                        size: 20,
                        color: Colors.grey.shade700,
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Archived Chats',
                        style: TextStyle(fontSize: 15),
                      ),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: 'settings',
                  child: Row(
                    children: [
                      Icon(
                        Icons.settings_rounded,
                        size: 20,
                        color: Colors.grey.shade700,
                      ),
                      const SizedBox(width: 12),
                      const Text(
                        'Chat Settings',
                        style: TextStyle(fontSize: 15),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        color: Colors.red,
        onRefresh: () async {
          await Future.delayed(const Duration(seconds: 1));
          if (mounted) {
            Get.snackbar(
              'Refreshed',
              'Messages updated',
              snackPosition: SnackPosition.TOP,
              duration: const Duration(seconds: 1),
              margin: const EdgeInsets.all(8),
            );
          }
        },
        child: CustomScrollView(
          slivers: [
            // Available entities horizontal list
            if (!_isSearching)
              SliverToBoxAdapter(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: availableEntities.length,
                        itemBuilder: (context, index) {
                          return _buildAvailableEntityCard(
                            availableEntities[index],
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            // Chat list
            _buildChatList(),
          ],
        ),
      ),
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onBottomNavTap,
      ),
      floatingActionButton: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.red.withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: FloatingActionButton(
          onPressed: _showNewChatDialog,
          backgroundColor: Colors.red,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          child: const Icon(Icons.edit_rounded, color: Colors.white, size: 24),
        ),
      ),
    );
  }

  Widget _buildAvailableEntityCard(Map<String, dynamic> entity) {
    return GestureDetector(
      onTap: () => _openChat(entity),
      child: Container(
        width: 70,
        margin: const EdgeInsets.only(right: 16),
        child: Column(
          children: [
            Stack(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: entity['color'].withOpacity(0.1),
                    border: Border.all(
                      color: entity['color'].withOpacity(0.3),
                      width: 2,
                    ),
                  ),
                  child: Icon(
                    entity['avatar'],
                    color: entity['color'],
                    size: 28,
                  ),
                ),
                if (entity['isOnline'])
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: const Color(0xFF4CAF50),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFFF8F9FA),
                          width: 3,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              entity['name'],
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
              maxLines: 2,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChatList() {
    final filteredChats = _getFilteredChats();

    if (filteredChats.isEmpty) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  _isSearching
                      ? Icons.search_off_rounded
                      : Icons.chat_bubble_outline_rounded,
                  size: 48,
                  color: Colors.grey.shade400,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                _isSearching ? 'No results found' : 'No conversations yet',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey.shade700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _isSearching
                    ? 'Try a different search term'
                    : 'Start a new conversation',
                style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
              ),
            ],
          ),
        ),
      );
    }

    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) => _buildChatTile(filteredChats[index]),
        childCount: filteredChats.length,
      ),
    );
  }

  Widget _buildChatTile(Map<String, dynamic> chat) {
    return Dismissible(
      key: Key(chat['name']),
      background: Container(
        margin: const EdgeInsets.only(bottom: 2),
        decoration: BoxDecoration(
          color: const Color(0xFF2196F3),
          borderRadius: BorderRadius.circular(16),
        ),
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(left: 24),
        child: const Icon(Icons.archive_rounded, color: Colors.white, size: 24),
      ),
      secondaryBackground: Container(
        margin: const EdgeInsets.only(bottom: 2),
        decoration: BoxDecoration(
          color: const Color(0xFFEF5350),
          borderRadius: BorderRadius.circular(16),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 24),
        child: const Icon(Icons.delete_rounded, color: Colors.white, size: 24),
      ),
      confirmDismiss: (direction) async {
        if (direction == DismissDirection.endToStart) {
          return await _showDeleteConfirmation(chat['name']);
        } else {
          Get.snackbar(
            'Archived',
            '${chat['name']} archived',
            snackPosition: SnackPosition.BOTTOM,
            margin: const EdgeInsets.all(16),
            duration: const Duration(seconds: 2),
          );
          return true;
        }
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => _openChat(chat),
            onLongPress: () => _showChatOptions(chat),
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  Stack(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: chat['color'].withOpacity(0.1),
                        ),
                        child: Icon(
                          chat['avatar'],
                          color: chat['color'],
                          size: 26,
                        ),
                      ),
                      if (chat['isOnline'])
                        Positioned(
                          right: 2,
                          bottom: 2,
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: const Color(0xFF4CAF50),
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white,
                                width: 2.5,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                chat['name'],
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.black87,
                                  letterSpacing: -0.2,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              chat['time'],
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: chat['unreadCount'] > 0
                                    ? chat['color']
                                    : Colors.grey.shade500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: chat['color'].withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                chat['type'],
                                style: TextStyle(
                                  fontSize: 9,
                                  fontWeight: FontWeight.w700,
                                  color: chat['color'],
                                  letterSpacing: 0.3,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                chat['lastMessage'],
                                style: TextStyle(
                                  fontSize: 14,
                                  color: chat['unreadCount'] > 0
                                      ? Colors.black87
                                      : Colors.grey.shade600,
                                  fontWeight: chat['unreadCount'] > 0
                                      ? FontWeight.w500
                                      : FontWeight.w400,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (chat['unreadCount'] > 0) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: chat['color'],
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                constraints: const BoxConstraints(minWidth: 24),
                                child: Center(
                                  child: Text(
                                    chat['unreadCount'].toString(),
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<bool> _showDeleteConfirmation(String name) async {
    return await Get.dialog<bool>(
          AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            title: const Text(
              'Delete Chat',
              style: TextStyle(fontWeight: FontWeight.w600),
            ),
            content: Text(
              'Are you sure you want to delete the conversation with $name?',
            ),
            actions: [
              TextButton(
                onPressed: () => Get.back(result: false),
                child: Text(
                  'Cancel',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ),
              TextButton(
                onPressed: () => Get.back(result: true),
                child: const Text(
                  'Delete',
                  style: TextStyle(color: Colors.red),
                ),
              ),
            ],
          ),
        ) ??
        false;
  }

  void _showChatOptions(Map<String, dynamic> chat) {
    Get.bottomSheet(
      Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.symmetric(vertical: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            ListTile(
              leading: Icon(
                Icons.push_pin_rounded,
                color: Colors.grey.shade700,
              ),
              title: const Text('Pin Conversation'),
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Pinned',
                  '${chat['name']} pinned to top',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            ListTile(
              leading: Icon(
                Icons.notifications_off_rounded,
                color: Colors.grey.shade700,
              ),
              title: const Text('Mute Notifications'),
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Muted',
                  'Notifications muted for ${chat['name']}',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.archive_rounded, color: Colors.grey.shade700),
              title: const Text('Archive Chat'),
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Archived',
                  '${chat['name']} archived',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete_rounded, color: Colors.red),
              title: const Text(
                'Delete Chat',
                style: TextStyle(color: Colors.red),
              ),
              onTap: () async {
                Get.back();
                if (await _showDeleteConfirmation(chat['name'])) {
                  Get.snackbar(
                    'Deleted',
                    'Chat with ${chat['name']} deleted',
                    snackPosition: SnackPosition.BOTTOM,
                  );
                }
              },
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  void _showNewChatDialog() {
    Get.bottomSheet(
      Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'Start New Chat',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 20),
            _buildNewChatOption(
              icon: Icons.local_hospital,
              color: Colors.red,
              title: 'Blood Banks',
              subtitle: 'Connect with blood banks',
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Blood Banks',
                  'Browse blood banks to connect',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            _buildNewChatOption(
              icon: Icons.local_hospital,
              color: Colors.blue,
              title: 'Hospitals',
              subtitle: 'Connect with hospitals',
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Hospitals',
                  'Browse hospitals to connect',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            _buildNewChatOption(
              icon: Icons.people,
              color: Colors.purple,
              title: 'Donors',
              subtitle: 'Connect with donors',
              onTap: () {
                Get.back();
                Get.toNamed('/search-donors');
              },
            ),
            _buildNewChatOption(
              icon: Icons.business,
              color: Colors.orange,
              title: 'Agencies',
              subtitle: 'Contact donation agencies',
              onTap: () {
                Get.back();
                Get.snackbar(
                  'Agencies',
                  'Browse agencies to connect',
                  snackPosition: SnackPosition.BOTTOM,
                );
              },
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  Widget _buildNewChatOption({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: ListTile(
        onTap: onTap,
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
        ),
        trailing: Icon(
          Icons.arrow_forward_ios_rounded,
          size: 16,
          color: Colors.grey.shade400,
        ),
      ),
    );
  }
}
