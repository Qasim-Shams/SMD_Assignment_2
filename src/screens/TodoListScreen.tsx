import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Priority } from '../types/todo';
import { useTodos } from '../context/TodoContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TodoList'>;

type FilterType = 'all' | 'active' | 'completed';

export const TodoListScreen: React.FC<Props> = ({ navigation }) => {
  const { todos, toggleTodo } = useTodos();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [todos]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header & Stats Banner */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>My Todo Tasks</Text>
            <Text style={styles.appSubtitle}>Organize your day effortlessly</Text>
          </View>
          <TouchableOpacity
            style={styles.headerAddBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddTask')}
          >
            <Text style={styles.headerAddBtnText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['all', 'active', 'completed'] as FilterType[]).map(tabKey => (
            <TouchableOpacity
              key={tabKey}
              style={[
                styles.filterTab,
                filter === tabKey && styles.filterTabActive,
              ]}
              onPress={() => setFilter(tabKey)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === tabKey && styles.filterTabTextActive,
                ]}
              >
                {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Todo List */}
        <FlatList
          data={filteredTodos}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>No tasks found</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'all'
                  ? 'Tap "+ Add Task" above or navigate forward to create one!'
                  : `You have no ${filter} tasks right now.`}
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const priorityColor = getPriorityColor(item.priority);
            return (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.checkboxTouch}
                  onPress={() => toggleTodo(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {item.completed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardContent}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('TaskDetail', { taskId: item.id })
                  }
                >
                  <View style={styles.cardTopRow}>
                    <Text
                      style={[
                        styles.taskTitle,
                        item.completed && styles.taskTitleCompleted,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
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
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  {item.description ? (
                    <Text
                      style={[
                        styles.taskDescription,
                        item.completed && styles.taskDescriptionCompleted,
                      ]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  ) : null}

                  <View style={styles.cardBottomRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        🏷️ {item.category}
                      </Text>
                    </View>
                    <Text style={styles.navForwardHint}>
                      Details ➔
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />

        {/* Bottom Navigation Forward Bar */}
        <View style={styles.footerNav}>
          <TouchableOpacity
            style={styles.forwardNavBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddTask')}
          >
            <Text style={styles.forwardNavBtnText}>
              Navigate Forward: Create New Task ➔
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  headerAddBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#2563EB',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'flex-start',
  },
  checkboxTouch: {
    paddingTop: 2,
    marginRight: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 18,
  },
  taskDescriptionCompleted: {
    color: '#CBD5E1',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  navForwardHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 30,
  },
  footerNav: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  forwardNavBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  forwardNavBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
