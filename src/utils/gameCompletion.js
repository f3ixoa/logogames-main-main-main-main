export const completionActions = ({ nextActivity, gameSelection }) => ({
  next: nextActivity || gameSelection,
  hasDefinedNextActivity: Boolean(nextActivity)
});
