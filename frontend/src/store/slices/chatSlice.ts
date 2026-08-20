import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  activeConversationId: number | null;
  activeTopicId: number | null;
}

const initialState: ChatState = {
  activeConversationId: null,
  activeTopicId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversationId(state, action: PayloadAction<number | null>) {
      state.activeConversationId = action.payload;
      state.activeTopicId = null;
    },
    setActiveTopicId(state, action: PayloadAction<number | null>) {
      state.activeTopicId = action.payload;
    },
  },
});

export const { setActiveConversationId, setActiveTopicId } =
  chatSlice.actions;

export default chatSlice.reducer;
