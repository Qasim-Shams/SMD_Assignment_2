import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Priority } from '../types/todo';
import { useTodos } from '../context/TodoContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;

export const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { getTodoById, toggleTodo, deleteTodo, getAdjacentTaskIds } = useTodos();

  const task = getTodoById(taskId);
  const { prevId, nextId } = getAdjacentTaskIds(taskId);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to remove this task from your list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTodo(taskId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Task Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            This task may have been removed or does not exist.
          </Text>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => navigation.navigate('TodoList')}
          >
            <Text style={styles.backButtonLargeText}>← Back to Task List</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priorityColor = getPriorityColor(task.priority);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Navigation Bar with Back & Forward Browser Buttons */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.navButtonText}>← Back to List</Text>
          </TouchableOpacity>

          <View style={styles.forwardBackPager}>
            <TouchableOpacity
              style={[
                styles.pagerButton,
                !prevId && styles.pagerButtonDisabled,
              ]}
              disabled={!prevId}
              onPress={() => {
                if (prevId) {
                  navigation.replace('TaskDetail', { taskId: prevId });
                }
              }}
            >
              <Text
                style={[
                  styles.pagerText,
                  !prevId && styles.pagerTextDisabled,
                ]}
              >
                ◀ Prev
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pagerButton,
                !nextId && styles.pagerButtonDisabled,
              ]}
              disabled={!nextId}
              onPress={() => {
                if (nextId) {
                  navigation.replace('TaskDetail', { taskId: nextId });
                }
              }}
            >
              <Text
                style={[
                  styles.pagerText,
                  !nextId && styles.pagerTextDisabled,
                ]}
              >
                Next ▶
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task Details Card */}
        <View style={styles.card}>
          {/* Status & Priority Row */}
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.statusBadge,
                task.completed ? styles.statusDone : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  task.completed ? styles.statusDoneText : styles.statusPendingText,
                ]}
              >
                {task.completed ? '✓ Completed' : '⏳ Pending'}
              </Text>
            </View>

            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${priorityColor}1A` },
              ]}
            >
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: priorityColor },
                ]}
              />
              <Text
                style={[
                  styles.priorityText,
                  { color: priorityColor },
                ]}
              >
                {task.priority.toUpperCase()} PRIORITY
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.taskTitle}>{task.title}</Text>

          {/* Meta Info: Category & Created At */}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Category:</Text>
            <Text style={styles.metaValue}>🏷️ {task.category}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created:</Text>
            <Text style={styles.metaValue}>🕒 {task.createdAt}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeading}>Description / Notes</Text>
          <Text style={styles.taskDescription}>
            {task.description || 'No additional description provided for this task.'}
          </Text>
        </View>

        {/* Action Controls */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              task.completed ? styles.toggleBtnPending : styles.toggleBtnDone,
            ]}
            activeOpacity={0.85}
            onPress={() => toggleTodo(task.id)}
          >
            <Text style={styles.toggleBtnText}>
              {task.completed ? '↩ Mark as Pending' : '✓ Mark as Completed'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={handleDelete}
          >
            <Text style={styles.deleteBtnText}>🗑 Delete Task</Text>
          </TouchableOpacity>
        </View>

        {/* Sequential Task Navigation Bar (Front & Back) */}
        <View style={styles.stepNavigationContainer}>
          <Text style={styles.stepNavTitle}>Task Sequence Navigation</Text>
          <View style={styles.stepNavRow}>
            <TouchableOpacity
              style={[
                styles.stepNavBtn,
                !prevId && styles.stepNavBtnDisabled,
              ]}
              disabled={!prevId}
              onPress={() => {
                if (prevId) {
                  navigation.replace('TaskDetail', { taskId: prevId });
                }
              }}
            >
              <Text
                style={[
                  styles.stepNavBtnText,
                  !prevId && styles.stepNavBtnTextDisabled,
                ]}
              >
                ⬅ Previous Task
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.stepNavBtn,
                !nextId && styles.stepNavBtnDisabled,
              ]}
              disabled={!nextId}
              onPress={() => {
                if (nextId) {
                  navigation.replace('TaskDetail', { taskId: nextId });
                }
              }}
            >
              <Text
                style={[
                  styles.stepNavBtnText,
                  !nextId && styles.stepNavBtnTextDisabled,
                ]}
              >
                Next Task ➔
              </Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 18,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
  },
  navButtonText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  forwardBackPager: {
    flexDirection: 'row',
    gap: 6,
  },
  pagerButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  pagerButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  pagerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pagerTextDisabled: {
    color: '#94A3B8',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusDone: {
    backgroundColor: '#DCFCE7',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontWeight: '700',
    fontSize: 12,
  },
  statusDoneText: {
    color: '#15803D',
  },
  statusPendingText: {
    color: '#B45309',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    width: 80,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  actionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  toggleBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleBtnDone: {
    backgroundColor: '#10B981',
  },
  toggleBtnPending: {
    backgroundColor: '#F59E0B',
  },
  toggleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  stepNavigationContainer: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepNavRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNavBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  stepNavBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
  stepNavBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  stepNavBtnTextDisabled: {
    color: '#94A3B8',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonLarge: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButtonLargeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
