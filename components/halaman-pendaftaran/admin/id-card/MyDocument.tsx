"use client";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
export const MyDocument = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.section}>
        <Image
          src={"./../../../../public/images/idcard-peserta.png"}
          style={{
            width: 100,
            height: 200,
            border: "2px solid black",
            objectFit: "contain",
          }}
        />
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);
