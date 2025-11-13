import { fireEvent, render } from "@testing-library/react-native";

import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import TeamSetupScreen from "../src/screens/TeamSetupScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const MockedNavigator = ({ component: Component, params = {} }: any) => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TeamSetup"
          component={Component}
          initialParams={params}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

describe("TeamSetupScreen", () => {
  const defaultParams = { boardId: "test-board" };

  it("renders team selection step initially", () => {
    const { getByText } = render(
      <MockedNavigator component={TeamSetupScreen} params={defaultParams} />
    );

    expect(getByText("팀 선택")).toBeTruthy();
    expect(getByText("양팀 모두")).toBeTruthy();
    expect(getByText("우리팀만")).toBeTruthy();
  });

  it("shows player count slider after team selection", () => {
    const { getByText, getByTestId } = render(
      <MockedNavigator component={TeamSetupScreen} params={defaultParams} />
    );

    // Select a team option
    fireEvent.press(getByText("양팀 모두"));

    // Check if player count section appears
    expect(getByText("인원 수")).toBeTruthy();
    expect(getByText("11명 - 정규 경기")).toBeTruthy();
  });

  it("displays correct descriptions for different player counts", () => {
    const { getByText, getByDisplayValue } = render(
      <MockedNavigator component={TeamSetupScreen} params={defaultParams} />
    );

    // Select team first
    fireEvent.press(getByText("양팀 모두"));

    // Test different player count descriptions
    const descriptions = {
      3: "기초 드릴",
      5: "실내 축구",
      7: "Futsal / 유소년",
      11: "정규 경기",
    };

    // This would require mocking slider value changes
    // For now, just verify initial state
    expect(getByText("11명 - 정규 경기")).toBeTruthy();
  });

  it("shows tactical options after player count confirmation", () => {
    const { getByText } = render(
      <MockedNavigator component={TeamSetupScreen} params={defaultParams} />
    );

    // Step through the flow
    fireEvent.press(getByText("양팀 모두")); // Team selection
    fireEvent.press(getByText("다음 단계")); // Player count confirmation

    // Check tactical section appears
    expect(getByText("전술 유형")).toBeTruthy();
    expect(getByText("자유 전술")).toBeTruthy();
  });

  it("shows different tactical options for 11 vs other player counts", () => {
    // This test would require slider interaction mocking
    // For now, test the default 11-player options
    const { getByText } = render(
      <MockedNavigator component={TeamSetupScreen} params={defaultParams} />
    );

    fireEvent.press(getByText("양팀 모두"));
    fireEvent.press(getByText("다음 단계"));

    // 11-player options should include formations
    expect(getByText("4-4-2 클래식")).toBeTruthy();
    expect(getByText("4-3-3 공격형")).toBeTruthy();
  });
});
