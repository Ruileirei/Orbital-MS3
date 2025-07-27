import { StyleSheet } from "react-native";
export const allReviewsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: {
    fontWeight: '600',
    marginTop: 6,
  },
  comment: {
    marginTop: 4,
    fontSize: 14,
  },
  time: {
    marginTop: 4,
    color: 'gray',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
  },
});