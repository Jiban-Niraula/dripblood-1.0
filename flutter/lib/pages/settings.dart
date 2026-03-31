import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../mywidgets/buttomnav.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  int _currentIndex = 4;
  bool _notificationsEnabled = true;
  bool _locationEnabled = true;
  bool _availableForDonation = true;
  bool _shareProfile = false;

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
          children: [
            // Profile Card
            _buildProfileCard(),

            const SizedBox(height: 16),

            // Personal Information Section
            _buildSection(
              title: "Personal Information",
              children: [
                _buildMenuItem(
                  icon: Icons.person,
                  title: "Full Name",
                  subtitle: "Jiban Niraula",
                  color: Colors.blue,
                  onTap: () {
                    _showEditDialog("Full Name", "Jiban Niraula");
                  },
                ),
                _buildMenuItem(
                  icon: Icons.email,
                  title: "Email Address",
                  subtitle: "jiban.niraula@example.com",
                  color: Colors.orange,
                  onTap: () {
                    _showEditDialog("Email Address", "jiban.niraula@example.com");
                  },
                ),
                _buildMenuItem(
                  icon: Icons.phone,
                  title: "Phone Number",
                  subtitle: "+977 9841234567",
                  color: Colors.green,
                  onTap: () {
                    _showEditDialog("Phone Number", "+977 9841234567");
                  },
                ),
                _buildMenuItem(
                  icon: Icons.cake,
                  title: "Date of Birth",
                  subtitle: "January 15, 1995",
                  color: Colors.pink,
                  onTap: () {
                    _showDatePicker();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.wc,
                  title: "Gender",
                  subtitle: "Male",
                  color: Colors.purple,
                  onTap: () {
                    _showGenderDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.location_city,
                  title: "Address",
                  subtitle: "Kathmandu, Nepal",
                  color: Colors.teal,
                  onTap: () {
                    _showEditDialog("Address", "Kathmandu, Nepal");
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Blood Information Section
            _buildSection(
              title: "Blood Information",
              children: [
                _buildMenuItem(
                  icon: Icons.bloodtype,
                  title: "Blood Type",
                  subtitle: "O+",
                  color: Colors.red,
                  onTap: () {
                    _showBloodTypeDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.monitor_weight,
                  title: "Weight",
                  subtitle: "65 kg",
                  color: Colors.orange,
                  onTap: () {
                    _showEditDialog("Weight (kg)", "65");
                  },
                ),
                _buildMenuItem(
                  icon: Icons.medical_information,
                  title: "Medical Conditions",
                  subtitle: "None reported",
                  color: Colors.blue,
                  onTap: () {
                    _showMedicalConditionsDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.vaccines,
                  title: "Allergies",
                  subtitle: "No allergies",
                  color: Colors.purple,
                  onTap: () {
                    _showEditDialog("Allergies", "No allergies");
                  },
                ),
                _buildMenuItem(
                  icon: Icons.history,
                  title: "Last Donation Date",
                  subtitle: "September 10, 2024",
                  color: Colors.green,
                  onTap: () {
                    _showDatePicker();
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Security Settings Section
            _buildSection(
              title: "Security Settings",
              children: [
                _buildMenuItem(
                  icon: Icons.lock,
                  title: "Change Password",
                  subtitle: "Last changed 30 days ago",
                  color: Colors.red,
                  onTap: () {
                    _showChangePasswordDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.security,
                  title: "Two-Factor Authentication",
                  subtitle: "Not enabled",
                  color: Colors.orange,
                  onTap: () {
                    _show2FADialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.fingerprint,
                  title: "Biometric Login",
                  subtitle: "Enable fingerprint or face recognition",
                  color: Colors.blue,
                  onTap: () {
                    _showBiometricDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.devices,
                  title: "Login Activity",
                  subtitle: "View recent login sessions",
                  color: Colors.purple,
                  onTap: () {
                    _showLoginActivityDialog();
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Preferences Section
            _buildSection(
              title: "Preferences",
              children: [
                _buildSwitchItem(
                  icon: Icons.notifications,
                  title: "Push Notifications",
                  subtitle: "Receive donation requests & updates",
                  color: Colors.orange,
                  value: _notificationsEnabled,
                  onChanged: (value) {
                    setState(() => _notificationsEnabled = value);
                  },
                ),
                _buildSwitchItem(
                  icon: Icons.location_on,
                  title: "Location Services",
                  subtitle: "Help others find you nearby",
                  color: Colors.green,
                  value: _locationEnabled,
                  onChanged: (value) {
                    setState(() => _locationEnabled = value);
                  },
                ),
                _buildSwitchItem(
                  icon: Icons.favorite,
                  title: "Available for Donation",
                  subtitle: "Show as available donor",
                  color: Colors.red,
                  value: _availableForDonation,
                  onChanged: (value) {
                    setState(() => _availableForDonation = value);
                  },
                ),
                _buildSwitchItem(
                  icon: Icons.share,
                  title: "Public Profile",
                  subtitle: "Allow others to view your profile",
                  color: Colors.indigo,
                  value: _shareProfile,
                  onChanged: (value) {
                    setState(() => _shareProfile = value);
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // App Settings
            _buildSection(
              title: "App Settings",
              children: [
                _buildMenuItem(
                  icon: Icons.language,
                  title: "Language",
                  subtitle: "English",
                  color: Colors.teal,
                  onTap: () {
                    _showLanguageDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.dark_mode,
                  title: "Theme",
                  subtitle: "Light Mode",
                  color: Colors.amber,
                  onTap: () {
                    _showThemeDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.storage,
                  title: "Storage & Cache",
                  subtitle: "Manage app data",
                  color: Colors.cyan,
                  onTap: () {
                    _showStorageDialog();
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Support Section
            _buildSection(
              title: "Support & About",
              children: [
                _buildMenuItem(
                  icon: Icons.help_outline,
                  title: "Help & Support",
                  subtitle: "Get help with the app",
                  color: Colors.blue,
                  onTap: () {
                    // Navigate to help
                  },
                ),
                _buildMenuItem(
                  icon: Icons.feedback,
                  title: "Send Feedback",
                  subtitle: "Share your thoughts with us",
                  color: Colors.green,
                  onTap: () {
                    _showFeedbackDialog();
                  },
                ),
                _buildMenuItem(
                  icon: Icons.privacy_tip,
                  title: "Privacy Policy",
                  subtitle: "Read our privacy policy",
                  color: Colors.purple,
                  onTap: () {
                    // Show privacy policy
                  },
                ),
                _buildMenuItem(
                  icon: Icons.description,
                  title: "Terms of Service",
                  subtitle: "Read terms and conditions",
                  color: Colors.indigo,
                  onTap: () {
                    // Show terms
                  },
                ),
                _buildMenuItem(
                  icon: Icons.info_outline,
                  title: "About DripBlood",
                  subtitle: "Version 1.0.0",
                  color: Colors.teal,
                  onTap: () {
                    _showAboutDialog();
                  },
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Logout Button (Prominent)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  _showLogoutDialog();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 4,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.logout, color: Colors.white),
                    SizedBox(width: 8),
                    Text(
                      "Logout",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Danger Zone
            _buildSection(
              title: "Danger Zone",
              children: [
                _buildMenuItem(
                  icon: Icons.delete_forever,
                  title: "Delete Account",
                  subtitle: "Permanently delete your account",
                  color: Colors.red,
                  onTap: () {
                    _showDeleteAccountDialog();
                  },
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Footer
            Text(
              "Made with ❤️ for saving lives",
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "DripBlood © 2024",
              style: TextStyle(
                fontSize: 11,
                color: Colors.grey.shade500,
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onBottomNavTap,
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      automaticallyImplyLeading: false,
      elevation: 0,
      backgroundColor: Colors.red,
      title: const Text(
        "Settings",
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
    );
  }

  Widget _buildProfileCard() {
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
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
            ),
            child: const CircleAvatar(
              radius: 35,
              backgroundColor: Colors.white,
              child: Icon(Icons.person, color: Colors.red, size: 40),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Jiban Niraula",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  "O+ Blood Type",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    "12 Donations",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.camera_alt, color: Colors.white),
            onPressed: () {
              _showImagePickerDialog();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSection({
    required String title,
    required List<Widget> children,
  }) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
          const Divider(height: 1),
          ...children,
        ],
      ),
    );
  }

  Widget _buildMenuItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    subtitle,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey.shade600,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: Colors.grey.shade400),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.red,
          ),
        ],
      ),
    );
  }

  // Edit Dialog
  void _showEditDialog(String title, String currentValue) {
    final controller = TextEditingController(text: currentValue);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit $title'),
        content: TextField(
          controller: controller,
          decoration: InputDecoration(
            labelText: title,
            border: const OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () {
              // Save changes
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('$title updated successfully')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  // Date Picker
  void _showDatePicker() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Colors.red,
            ),
          ),
          child: child!,
        );
      },
    );
    if (date != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Date updated successfully')),
      );
    }
  }

  // Gender Dialog
  void _showGenderDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Gender'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _radioOption('Male', Icons.male),
            _radioOption('Female', Icons.female),
            _radioOption('Other', Icons.transgender),
            _radioOption('Prefer not to say', Icons.question_mark),
          ],
        ),
      ),
    );
  }

  Widget _radioOption(String label, IconData icon) {
    return ListTile(
      leading: Icon(icon, color: Colors.red),
      title: Text(label),
      onTap: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gender updated to $label')),
        );
      },
    );
  }

  // Blood Type Dialog
  void _showBloodTypeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Blood Type'),
        content: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']
              .map((type) => ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Blood type updated to $type')),
              );
            },
            child: Text(type),
          ))
              .toList(),
        ),
      ),
    );
  }

  // Medical Conditions Dialog
  void _showMedicalConditionsDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Medical Conditions'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CheckboxListTile(
              title: const Text('Diabetes'),
              value: false,
              onChanged: (value) {},
              activeColor: Colors.red,
            ),
            CheckboxListTile(
              title: const Text('Hypertension'),
              value: false,
              onChanged: (value) {},
              activeColor: Colors.red,
            ),
            CheckboxListTile(
              title: const Text('Heart Disease'),
              value: false,
              onChanged: (value) {},
              activeColor: Colors.red,
            ),
            CheckboxListTile(
              title: const Text('None'),
              value: true,
              onChanged: (value) {},
              activeColor: Colors.red,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Medical conditions updated')),
              );
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  // Change Password Dialog
  void _showChangePasswordDialog() {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Change Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: currentPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Current Password',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: newPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'New Password',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock_outline),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: confirmPasswordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Confirm New Password',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.lock_outline),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Password changed successfully')),
              );
            },
            child: const Text('Change Password'),
          ),
        ],
      ),
    );
  }

  // 2FA Dialog
  void _show2FADialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Two-Factor Authentication'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Enable two-factor authentication to add an extra layer of security to your account.'),
            SizedBox(height: 16),
            Text('You will receive a verification code via SMS or email when logging in.'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('2FA enabled successfully')),
              );
            },
            child: const Text('Enable'),
          ),
        ],
      ),
    );
  }

  // Biometric Dialog
  void _showBiometricDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Biometric Authentication'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.fingerprint, color: Colors.red),
              title: const Text('Fingerprint'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Fingerprint enabled')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.face, color: Colors.red),
              title: const Text('Face Recognition'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Face recognition enabled')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Login Activity Dialog
  void _showLoginActivityDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Recent Login Activity'),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView(
            shrinkWrap: true,
            children: [
              _loginActivityItem('Android Device', 'Kathmandu, Nepal', 'Just now', true),
              _loginActivityItem('Web Browser', 'Kathmandu, Nepal', '2 days ago', false),
              _loginActivityItem('iOS Device', 'Pokhara, Nepal', '1 week ago', false),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _loginActivityItem(String device, String location, String time, bool current) {
    return ListTile(
      leading: Icon(
        device.contains('Android') ? Icons.phone_android :
        device.contains('iOS') ? Icons.phone_iphone : Icons.computer,
        color: Colors.red,
      ),
      title: Text(device),
      subtitle: Text('$location\n$time'),
      trailing: current ? const Chip(
        label: Text('Current', style: TextStyle(fontSize: 10)),
        backgroundColor: Colors.green,
      ) : null,
    );
  }

  // Image Picker Dialog
  void _showImagePickerDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Change Profile Picture'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt, color: Colors.red),
              title: const Text('Take Photo'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening camera...')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library, color: Colors.blue),
              title: const Text('Choose from Gallery'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening gallery...')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete, color: Colors.red),
              title: const Text('Remove Photo'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Profile picture removed')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  // Storage Dialog
  void _showStorageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Storage & Cache'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('App Storage: 45 MB'),
            const SizedBox(height: 8),
            const Text('Cache: 12 MB'),
            const SizedBox(height: 8),
            const Text('Images: 20 MB'),
            const SizedBox(height: 8),
            const Text('Documents: 13 MB'),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 8),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cache cleared successfully')),
                );
              },
              child: const Text('Clear Cache'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  // Feedback Dialog
  void _showFeedbackDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Send Feedback'),
        content: TextField(
          controller: controller,
          maxLines: 5,
          decoration: const InputDecoration(
            hintText: 'Tell us what you think...',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            onPressed: () {
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Thank you for your feedback!')),
              );
            },
            child: const Text('Send'),
          ),
        ],
      ),
    );
  }

  void _showLanguageDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _languageOption('English', true),
            _languageOption('नेपाली', false),
            _languageOption('हिन्दी', false),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  Widget _languageOption(String language, bool selected) {
    return RadioListTile<bool>(
      title: Text(language),
      value: true,
      groupValue: selected,
      onChanged: (value) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Language changed to $language')),
        );
      },
      activeColor: Colors.red,
    );
  }

  void _showThemeDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Theme'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _themeOption('Light Mode', Icons.light_mode, true),
            _themeOption('Dark Mode', Icons.dark_mode, false),
            _themeOption('System Default', Icons.settings_suggest, false),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  Widget _themeOption(String theme, IconData icon, bool selected) {
    return ListTile(
      leading: Icon(icon, color: selected ? Colors.red : Colors.grey),
      title: Text(theme),
      trailing: selected ? const Icon(Icons.check, color: Colors.red) : null,
      onTap: () {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Theme changed to $theme')),
        );
      },
    );
  }

  void _showAboutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Image.asset("assets/logo.png", height: 32),
            const SizedBox(width: 10),
            const Text('About DripBlood'),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'DripBlood',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            SizedBox(height: 8),
            Text('Version 1.0.0'),
            SizedBox(height: 16),
            Text(
              'A Blood Donation Simplification System designed to connect donors with those in need and awaken government bodies about the possibilities of such services.',
              style: TextStyle(fontSize: 13),
            ),
            SizedBox(height: 16),
            Text(
              '© 2024 DripBlood\nAll rights reserved.',
              style: TextStyle(fontSize: 11, color: Colors.grey),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: const [
            Icon(Icons.logout, color: Colors.red),
            SizedBox(width: 10),
            Text('Logout'),
          ],
        ),
        content: const Text(
          'Are you sure you want to logout from DripBlood?',
          style: TextStyle(fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () async {
              // 1. Clear the stored token
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove("token"); // or prefs.clear() to remove everything

              // 2. Navigate to login screen and clear history
              Get.offAllNamed('/login');

              // 3. Show confirmation message
              ScaffoldMessenger.of(Get.context!).showSnackBar(
                const SnackBar(content: Text('Logged out successfully')),
              );
            },
            child: const Text('Logout'),
          ),

        ],
      ),
    );
  }

  void _showDeleteAccountDialog() {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text(
          'Delete Account',
          style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              '⚠️ WARNING',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'This action cannot be undone. All your data, including:',
              style: TextStyle(fontSize: 13),
            ),
            const SizedBox(height: 8),
            const Text(
              '• Personal information\n• Donation history\n• Saved preferences\n• Account achievements',
              style: TextStyle(fontSize: 12),
            ),
            const SizedBox(height: 12),
            const Text(
              'will be permanently deleted.',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              decoration: const InputDecoration(
                labelText: 'Type DELETE to confirm',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            onPressed: () {
              if (controller.text == 'DELETE') {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Account deletion request submitted'),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Please type DELETE to confirm'),
                  ),
                );
              }
            },
            child: const Text('Delete Account'),
          ),
        ],
      ),
    );
  }
}