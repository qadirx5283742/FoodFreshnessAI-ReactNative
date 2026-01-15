import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      );
    }

    return this.props.children;
  }
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}) {
  // Use light theme colors as fallback (ErrorBoundary is outside ThemeProvider)
  const colors = Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.error + "20" },
          ]}
        >
          <MaterialCommunityIcons
            name="alert-circle"
            size={64}
            color={colors.error}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Oops! Something went wrong
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We're sorry for the inconvenience. The app encountered an unexpected
          error.
        </Text>

        {__DEV__ && error && (
          <View
            style={[styles.errorContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.errorTitle, { color: colors.error }]}>
              Error Details:
            </Text>
            <Text style={[styles.errorText, { color: colors.text }]}>
              {error.toString()}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={onReset}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  errorContainer: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

// Wrapper to provide theme context
export const ErrorBoundary: React.FC<Props> = (props) => {
  return <ErrorBoundaryClass {...props}>{props.children}</ErrorBoundaryClass>;
};
