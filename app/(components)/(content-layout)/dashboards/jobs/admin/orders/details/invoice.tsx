import { OrderFullJobType, OrderFulltType } from "@/app/lib/types";
import {
  Document,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
export const generateOrderPDFBlob = async (
  order: OrderFullJobType,
): Promise<Blob> => {
  if (!order) throw new Error("Order is required to generate the PDF.");

  const styles = StyleSheet.create({
    page: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      backgroundColor: "green",
      color: "white",
      fontSize: 12,
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "white",
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 10,
    },
    author: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 18,
      margin: 12,
    },
    text: {
      margin: 12,
      fontSize: 14,
      textAlign: "justify",
    },
    footer: {
      padding: "100px",
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
      color: "white",
    },
    table: {
      display: "table",
      width: "auto",
      marginVertical: 10,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#fff",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      padding: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#fff",
      flexGrow: 1,
      fontSize: 10,
    },
    groupHeader: {
      fontSize: 14,
      marginBottom: 5,
      fontWeight: "bold",
    },
  });

  // Define the PDF Document
  const OrderInvoicePdf = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>~ {new Date().toLocaleString()} ~</Text>
        <Text style={styles.title}>Seller Jobx</Text>
        <Text style={styles.author}>Phone: xxxxxxxxxxxx</Text>
        <Text style={styles.subtitle}>Email: jobx@gmail.com</Text>
        <Text style={styles.subtitle}>
          Location: Silicon Valley,{"\n"}
          Industrial region around the southern{"\n"}
          shores of San Francisco Bay, California, U.S.
        </Text>

        <Text style={styles.header}>~ Order Summary ~</Text>
        <Text style={styles.title}>Order Buyer Invoice</Text>

        {/* Table Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Package Name</Text>
            <Text style={styles.tableCell}>Payment Provider</Text>
            <Text style={styles.tableCell}>Amount</Text>
            <Text style={styles.tableCell}>Currency</Text>
            <Text style={styles.tableCell}>Default Amount</Text>
            <Text style={styles.tableCell}>Payment Status</Text>
          </View>

          {/* Table Rows */}

          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{order.package_name}</Text>
            <Text style={styles.tableCell}>{order.payment_provider}</Text>
            <Text style={styles.tableCell}>${order.amount}</Text>
            <Text style={styles.tableCell}>{order.paid_in_currency}</Text>
            <Text style={styles.tableCell}>${order.default_amount}</Text>
            <Text style={styles.tableCell}>{order.payment_status}</Text>
          </View>
        </View>

        {/* Individual Order Details */}

        <Text style={styles.text}>
          <Text>Date: {new Date(order.createdAt).toLocaleString()}</Text>
          {"\n"}
          <Text>Order ID: {order.order_id}</Text>
          {"\n"}
          <Text>Transaction ID: {order.transaction_id}</Text>
          {"\n"}
          <Text>Payment Status: {order.payment_status}</Text>
          {"\n"}
          <Text>Total Paid: ${order.amount}</Text>
        </Text>

        <Text style={styles.footer}>~ Thank you for shopping with us ~</Text>
      </Page>
    </Document>
  );

  // Generate the PDF blob
  const pdfBlob = await pdf(<OrderInvoicePdf />).toBlob();
  return pdfBlob;
};
