import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* =========================================================================
   1. KHIDMAT CONNECT THEME PALETTE
   Khidmat Connect style: Vibrant Electric Lime, Sleek Dark, Crisp Slate
   ========================================================================= */
const THEME = {
  primaryLime: '#76C800', // Khidmat Connect signature lime
  limeLight: '#E8FDC9',
  limeDarkText: '#2B5700',
  darkBg: '#121212',
  cardBg: '#FFFFFF',
  bgGray: '#F5F6F8',
  textDark: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
};

/* =========================================================================
   2. BOOKINGS STATE & CONTEXT
   Allows newly accepted offers to show up immediately in the Bookings tab.
   ========================================================================= */
export interface BookingItem {
  id: string;
  service: string;
  location: string;
  provider: string;
  price: string;
  date: string;
  status: 'Confirmed' | 'Completed';
}

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'b-101',
    service: 'AC Technician',
    location: 'Downtown',
    provider: 'FastFix Pro',
    price: '$45',
    date: 'Today, 2:30 PM',
    status: 'Confirmed',
  },
  {
    id: 'b-100',
    service: 'Plumber',
    location: 'Midtown',
    provider: 'Reliable Care',
    price: '$35',
    date: 'Yesterday',
    status: 'Completed',
  },
];

interface BookingContextType {
  bookings: BookingItem[];
  addBooking: (booking: Omit<BookingItem, 'id' | 'date' | 'status'>) => void;
}

const BookingContext = createContext<BookingContextType>({
  bookings: INITIAL_BOOKINGS,
  addBooking: () => {},
});

/* =========================================================================
   3. MOCK DATA
   ========================================================================= */
const SERVICES = [
  { id: '1', title: 'AC Technician', icon: '❄️', tag: 'Fast Response' },
  { id: '2', title: 'Plumber', icon: '🔧', tag: 'Top Rated' },
  { id: '3', title: 'Mechanic', icon: '🚗', tag: 'On Demand' },
  { id: '4', title: 'Electrician', icon: '⚡', tag: 'Certified' },
  { id: '5', title: 'Carpenter', icon: '🪚', tag: 'Custom Work' },
  { id: '6', title: 'Painter', icon: '🎨', tag: 'Interior/Exterior' },
];

const LOCATIONS = [
  'Downtown (City Center)',
  'Uptown (North District)',
  'Midtown (Commercial Zone)',
  'Suburbs (West End)',
];

const OFFERS = [
  { id: 'o1', provider: 'FastFix Solutions', rating: '4.9 ★ (120)', price: '$40', eta: '15 mins away' },
  { id: 'o2', provider: 'Prime Expert Care', rating: '4.8 ★ (85)', price: '$50', eta: '25 mins away' },
  { id: 'o3', provider: 'Speedy Pro Team', rating: '4.7 ★ (64)', price: '$35', eta: '35 mins away' },
];

/* =========================================================================
   4. SCREEN 1: SERVICE SELECT (Khidmat Connect service grid)
   ========================================================================= */
const ServiceInfoButton = () => (
  <TouchableOpacity
    style={styles.headerPill}
    onPress={() =>
      Alert.alert(
        'Khidmat Connect',
        'Choose a service, select your area, and pick the best offer from verified specialists!'
      )
    }
  >
    <Text style={styles.headerPillText}>ℹ️ Info</Text>
  </TouchableOpacity>
);

function ServiceSelectScreen({ navigation }: any) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Khidmat Connect',
      headerRight: ServiceInfoButton,
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Text style={styles.sectionHeader}>What service do you need?</Text>
      <Text style={styles.sectionSub}>Choose your specialist at your own price</Text>

      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate('LocationSelect', { service: item.title })}
          >
            <View style={styles.iconCircle}>
              <Text style={styles.serviceIcon}>{item.icon}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceTag}>{item.tag}</Text>
            </View>
            <View style={styles.limeArrowBadge}>
              <Text style={styles.limeArrowText}>→</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* =========================================================================
   5. SCREEN 2: LOCATION SELECT (Khidmat Connect pickup/location selection)
   ========================================================================= */
function LocationSelectScreen({ route, navigation }: any) {
  const { service } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${service} Location`,
    });
  }, [navigation, service]);

  return (
    <View style={styles.screen}>
      {/* Parameter preview banner */}
      <View style={styles.paramBanner}>
        <Text style={styles.paramBannerLabel}>SELECTED SERVICE</Text>
        <Text style={styles.paramBannerValue}>{service}</Text>
      </View>

      <Text style={styles.sectionHeader}>Select Service Location</Text>
      <Text style={styles.sectionSub}>Where should the specialist arrive?</Text>

      {LOCATIONS.map((loc) => (
        <TouchableOpacity
          key={loc}
          style={styles.locationCard}
          onPress={() => navigation.navigate('Offers', { service, location: loc })}
        >
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationText}>{loc}</Text>
          <Text style={styles.locationSelectHint}>Select</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* =========================================================================
   6. SCREEN 3: OFFERS SCREEN (Khidmat Connect incoming specialist bids)
   ========================================================================= */
const FilterOffersButton = () => (
  <TouchableOpacity
    style={styles.headerPill}
    onPress={() => Alert.alert('Filter', 'Offers sorted by best price & nearest arrival.')}
  >
    <Text style={styles.headerPillText}>⚡ Best Fares</Text>
  </TouchableOpacity>
);

function OffersScreen({ route, navigation }: any) {
  const { service, location } = route.params;
  const { addBooking } = useContext(BookingContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Specialist Offers',
      headerRight: FilterOffersButton,
    });
  }, [navigation]);

  const handleAccept = (offer: typeof OFFERS[0]) => {
    // 1. Add to the shared Bookings state so it shows in the Bookings tab!
    addBooking({
      service,
      location,
      provider: offer.provider,
      price: offer.price,
    });

    // 2. Navigate forward to Confirmation screen
    navigation.navigate('Confirmation', {
      service,
      location,
      provider: offer.provider,
      price: offer.price,
    });
  };

  return (
    <View style={styles.screen}>
      {/* Current booking parameters banner */}
      <View style={styles.routePill}>
        <Text style={styles.routePillText}>
          {service} • {location}
        </Text>
      </View>

      <Text style={styles.sectionHeader}>Specialists Responding</Text>
      <Text style={styles.sectionSub}>Accept an offer to confirm your booking</Text>

      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.offerCard}>
            <View style={styles.offerMain}>
              <View style={styles.providerRow}>
                <Text style={styles.providerName}>{item.provider}</Text>
                <View style={styles.pricePill}>
                  <Text style={styles.priceText}>{item.price}</Text>
                </View>
              </View>

              <Text style={styles.offerMeta}>
                {item.rating} • ⏱️ {item.eta}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.limeButton}
              onPress={() => handleAccept(item)}
            >
              <Text style={styles.limeButtonText}>Accept Offer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

/* =========================================================================
   7. SCREEN 4: CONFIRMATION SCREEN
   ========================================================================= */
function ConfirmationScreen({ route, navigation }: any) {
  const { service, location, provider, price } = route.params;

  return (
    <View style={styles.screen}>
      <View style={styles.ticketCard}>
        <View style={styles.successIconBadge}>
          <Text style={styles.successCheck}>✓</Text>
        </View>

        <Text style={styles.successHeading}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>
          Your specialist has accepted and is on the way.
        </Text>

        <View style={styles.divider} />

        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>Service</Text>
          <Text style={styles.ticketValue}>{service}</Text>
        </View>

        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>Location</Text>
          <Text style={styles.ticketValue}>{location}</Text>
        </View>

        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>Specialist</Text>
          <Text style={styles.ticketValue}>{provider}</Text>
        </View>

        <View style={styles.ticketRow}>
          <Text style={styles.ticketLabel}>Agreed Price</Text>
          <Text style={styles.ticketPrice}>{price}</Text>
        </View>
      </View>

      {/* Button to view in Bookings tab */}
      <TouchableOpacity
        style={styles.limeButtonFull}
        onPress={() => {
          // Reset stack and jump to Bookings tab to see the new booking
          navigation.popToTop();
          navigation.navigate('Bookings');
        }}
      >
        <Text style={styles.limeButtonText}>View in My Bookings Tab →</Text>
      </TouchableOpacity>

      {/* Reset Stack Button */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.secondaryButtonText}>Book Another Service (popToTop)</Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================================
   8. SCREEN 5: BOOKINGS SCREEN (Now shows all active and past bookings!)
   ========================================================================= */
function BookingsScreen({ navigation }: any) {
  const { bookings } = useContext(BookingContext);

  return (
    <View style={styles.screen}>
      <Text style={styles.sectionHeader}>My Bookings ({bookings.length})</Text>
      <Text style={styles.sectionSub}>All accepted service offers and history</Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <View style={styles.bookingCardHeader}>
              <View style={styles.bookingTitleGroup}>
                <Text style={styles.bookingServiceTitle}>{item.service}</Text>
                <Text style={styles.bookingDate}>{item.date}</Text>
              </View>
              <View
                style={
                  item.status === 'Confirmed'
                    ? styles.statusBadgeConfirmed
                    : styles.statusBadgeCompleted
                }
              >
                <Text
                  style={
                    item.status === 'Confirmed'
                      ? styles.statusTextConfirmed
                      : styles.statusTextCompleted
                  }
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bookingDetailRow}>
              <Text style={styles.bookingDetailLabel}>📍 Location:</Text>
              <Text style={styles.bookingDetailVal}>{item.location}</Text>
            </View>

            <View style={styles.bookingDetailRow}>
              <Text style={styles.bookingDetailLabel}>👤 Specialist:</Text>
              <Text style={styles.bookingDetailVal}>{item.provider}</Text>
            </View>

            <View style={styles.bookingFooter}>
              <Text style={styles.bookingPriceLabel}>Price:</Text>
              <Text style={styles.bookingPriceText}>{item.price}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.limeButtonFull}
        onPress={() => navigation.navigate('Services')}
      >
        <Text style={styles.limeButtonText}>+ Request New Service</Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================================================================
   9. NAVIGATORS SETUP (Khidmat Connect Theme Colors on Header & Tabs)
   ========================================================================= */
const Stack = createNativeStackNavigator();

const confirmationOptions = ({ navigation }: any) => ({
  headerTitle: 'Booking Details',
  headerRight: () => (
    <TouchableOpacity
      style={styles.headerPill}
      onPress={() => navigation.popToTop()}
    >
      <Text style={styles.headerPillText}>Done ✓</Text>
    </TouchableOpacity>
  ),
});

function ServiceStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: THEME.darkBg },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ServiceSelect" component={ServiceSelectScreen} />
      <Stack.Screen name="LocationSelect" component={LocationSelectScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={confirmationOptions}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const renderServicesTabIcon = () => <Text style={styles.tabIcon}>⚡</Text>;
const renderBookingsTabIcon = () => <Text style={styles.tabIcon}>📋</Text>;

export default function App() {
  const [bookings, setBookings] = useState<BookingItem[]>(INITIAL_BOOKINGS);

  const addBooking = (newBooking: Omit<BookingItem, 'id' | 'date' | 'status'>) => {
    const item: BookingItem = {
      ...newBooking,
      id: `b-${Date.now()}`,
      date: 'Just now',
      status: 'Confirmed',
    };
    // Prepend new booking to the top of the list
    setBookings((prev) => [item, ...prev]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: THEME.primaryLime,
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: styles.tabBar,
            headerStyle: { backgroundColor: THEME.darkBg },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Tab.Screen
            name="Services"
            component={ServiceStack}
            options={{
              headerShown: false,
              tabBarLabel: 'Services',
              tabBarIcon: renderServicesTabIcon,
            }}
          />
          <Tab.Screen
            name="Bookings"
            component={BookingsScreen}
            options={{
              tabBarLabel: 'My Bookings',
              tabBarIcon: renderBookingsTabIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </BookingContext.Provider>
  );
}

/* =========================================================================
   10. KHIDMAT CONNECT STYLES
   ========================================================================= */
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.bgGray,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textDark,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: THEME.textMuted,
    marginBottom: 16,
  },
  headerPill: {
    backgroundColor: THEME.primaryLime,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  headerPillText: {
    color: THEME.darkBg,
    fontWeight: '700',
    fontSize: 12,
  },
  serviceCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.limeLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  serviceIcon: {
    fontSize: 22,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textDark,
  },
  serviceTag: {
    fontSize: 12,
    color: THEME.limeDarkText,
    fontWeight: '600',
    marginTop: 2,
  },
  limeArrowBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.limeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limeArrowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.limeDarkText,
  },
  paramBanner: {
    backgroundColor: THEME.darkBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  paramBannerLabel: {
    color: THEME.primaryLime,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  paramBannerValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  locationPin: {
    fontSize: 18,
    marginRight: 10,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textDark,
    flex: 1,
  },
  locationSelectHint: {
    color: THEME.limeDarkText,
    fontWeight: '700',
    fontSize: 13,
  },
  routePill: {
    backgroundColor: THEME.limeLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  routePillText: {
    color: THEME.limeDarkText,
    fontWeight: '700',
    fontSize: 13,
  },
  offerCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  offerMain: {
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.textDark,
  },
  pricePill: {
    backgroundColor: THEME.darkBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: THEME.primaryLime,
    fontSize: 16,
    fontWeight: '800',
  },
  offerMeta: {
    fontSize: 13,
    color: THEME.textMuted,
  },
  limeButton: {
    backgroundColor: THEME.primaryLime,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  limeButtonFull: {
    backgroundColor: THEME.primaryLime,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  limeButtonText: {
    color: THEME.darkBg,
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: THEME.border,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
  },
  secondaryButtonText: {
    color: THEME.textDark,
    fontSize: 14,
    fontWeight: '600',
  },
  ticketCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 16,
  },
  successIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.primaryLime,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  successCheck: {
    fontSize: 26,
    fontWeight: 'bold',
    color: THEME.darkBg,
  },
  successHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME.textDark,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: THEME.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 10,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  ticketLabel: {
    fontSize: 14,
    color: THEME.textMuted,
  },
  ticketValue: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textDark,
  },
  ticketPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.limeDarkText,
  },
  bookingCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingTitleGroup: {
    flex: 1,
  },
  bookingServiceTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: THEME.textDark,
  },
  bookingDate: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  statusBadgeConfirmed: {
    backgroundColor: THEME.limeLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextConfirmed: {
    color: THEME.limeDarkText,
    fontWeight: '700',
    fontSize: 12,
  },
  statusBadgeCompleted: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextCompleted: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  bookingDetailLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    width: 100,
  },
  bookingDetailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.textDark,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  bookingPriceLabel: {
    fontSize: 13,
    color: THEME.textMuted,
    marginRight: 6,
  },
  bookingPriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: THEME.limeDarkText,
  },
  tabBar: {
    backgroundColor: THEME.darkBg,
    borderTopColor: '#262626',
  },
  tabIcon: {
    fontSize: 18,
  },
});
