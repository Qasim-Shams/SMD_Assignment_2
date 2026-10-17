import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Priority, Category } from '../types/todo';
import { useTodos } from '../context/TodoContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const categories: Category[] = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];
const priorities: { label: string; value: Priority; color: string }[] = [
  { label: 'Low', value: 'low', color: '#10B981' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High', value: 'high', color: '#EF4444' },
];

export const AddTaskScreen: React.FC<Props> = ({ navigation }) => {
  const { addTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Work');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('medium');

  const handleSaveAndGoBack = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please provide a title for the task.');
      return;
    }

    addTodo({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
    });

    navigation.goBack();
  };

  const handleSaveAndGoForward = () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please provide a title for the task.');
      return;
    }

    const newId = addTodo({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
    });

    // Replace or navigate forward directly to TaskDetail
    navigation.replace('TaskDetail', { taskId: newId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar / Quick Actions */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back to List</Text>
          </TouchableOpacity>
          <Text style={styles.screenStepIndicator}>Step 2 of 2</Text>
        </View>

        <Text style={styles.pageTitle}>Create New Task</Text>
        <Text style={styles.pageSubtitle}>
          Fill out the details below to add a new task to your list.
        </Text>

        {/* Task Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Task Title <Text style={styles.requiredStar}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Prepare presentation slides"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Task Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description / Notes</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Add relevant notes, links, or instructions..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Priority Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Priority Level</Text>
          <View style={styles.prioritySelectorRow}>
            {priorities.map(p => {
              const isSelected = selectedPriority === p.value;
              return (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityOption,
                    isSelected && {
                      backgroundColor: `${p.color}18`,
                      borderColor: p.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setSelectedPriority(p.value)}
                >
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: p.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.priorityOptionText,
                      isSelected && { color: p.color, fontWeight: '700' },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryWrap}>
            {categories.map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Action & Navigation Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.saveForwardBtn}
            activeOpacity={0.85}
            onPress={handleSaveAndGoForward}
          >
            <Text style={styles.saveForwardBtnText}>
              Save & Forward to Details ➔
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveBackBtn}
            activeOpacity={0.85}
            onPress={handleSaveAndGoBack}
          >
            <Text style={styles.saveBackBtnText}>
              ✓ Save & Back to List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Discard & Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 13,
  },
  screenStepIndicator: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 100,
  },
  prioritySelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  priorityOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
  },
  actionsContainer: {
    marginTop: 16,
    gap: 12,
  },
  saveForwardBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveForwardBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  saveBackBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBackBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
