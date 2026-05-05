export function hasAccess(user) {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.paymentSubscription?.isActive) return true;
  return Boolean(user.trial?.isActive);
}

export function getAccessLabel(user) {
  if (!user) return "No access";
  if (user.role === "admin") return "Admin access";
  if (user.paymentSubscription?.isActive) return "Pro member";
  if (user.trial?.isActive) return `${user.trial.daysLeft} day trial left`;
  return "Upgrade required";
}
