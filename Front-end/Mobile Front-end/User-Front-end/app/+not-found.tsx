import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Ionicons name="warning-outline" size={80} color="#F59E0B" style={styles.warningIcon} />
            <View style={styles.circle} />
          </View>
          
          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.subtitle}>
            Oops! The page you're looking for doesn't exist or has been moved.
          </Text>
          
          <Link href="/" asChild>
            <View style={styles.button}>
              <Ionicons name="home-outline" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Back to Home</Text>
            </View>
          </Link>
        </View>
        
        <Text style={styles.footerText}> 2025 Dating App. All rights reserved.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 32,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    transform: [{ scale: 1.2 }],
  },
  warningIcon: {
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 48,
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
});
