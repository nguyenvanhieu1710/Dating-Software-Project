import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Card, Text, useTheme, RadioButton, Menu, Button } from 'react-native-paper';
import FormInput from './FormInput';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface BasicInfoSectionProps {
  formData: {
    first_name: string;
    email: string;
    phone_number: string;
    dob: string;
    gender: string;
  };
  onUpdateField: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onUpdateField
}) => {
  const theme = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age.toString();
    } catch {
      return '';
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onUpdateField('dob', selectedDate.toISOString());
    }
  };

  const genderOptions = ['male', 'female', 'other'];

  return (
    <Card style={{ marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 12 }} mode="elevated">
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{ fontWeight: 'bold', marginBottom: 16, fontFamily: theme.fonts.bodyLarge.fontFamily }}
        >
          Basic Information
        </Text>

        <FormInput
          label="First Name"
          value={formData.first_name}
          onChangeText={(text) => onUpdateField('first_name', text)}
          placeholder="Enter your first name"
          maxLength={50}
        />

        <FormInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => onUpdateField('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          maxLength={100}
        />

        <FormInput
          label="Phone Number"
          value={formData.phone_number}
          onChangeText={(text) => onUpdateField('phone_number', text)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          maxLength={20}
        />

        {/* Date of Birth */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '600', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Date of Birth
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#D1D5DB',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              backgroundColor: '#F9FAFB'
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color="#6B7280" style={{ marginRight: 8 }} />
            <Text style={{ fontSize: 16, color: formData.dob ? '#111827' : '#9CA3AF', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              {formData.dob ? formatDate(formData.dob) : 'Select your date of birth'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.dob ? new Date(formData.dob) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
          {formData.dob && (
            <Text style={{ marginTop: 6, color: '#4F46E5', fontWeight: '500', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
              Age: {calculateAge(formData.dob)} years old
            </Text>
          )}
        </View>

        {/* Gender */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ marginBottom: 6, color: '#374151', fontWeight: '600', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
            Gender
          </Text>
          <RadioButton.Group
            onValueChange={(value) => onUpdateField('gender', value)}
            value={formData.gender}
          >
            {genderOptions.map((option) => (
              <View key={option} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <RadioButton value={option} color="#4F46E5" />
                <Text style={{ fontSize: 16, color: '#111827', fontFamily: theme.fonts.bodyLarge.fontFamily }}>
                  {option}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        </View>
      </Card.Content>
    </Card>
  );
};

export default BasicInfoSection;