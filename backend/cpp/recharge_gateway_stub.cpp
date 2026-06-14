#include <chrono>
#include <iostream>
#include <string>
#include <thread>

struct RechargeRequest {
  std::string mobileNumber;
  std::string operatorName;
  int amount;
};

class RechargeGateway {
 public:
  bool process(const RechargeRequest& request) const {
    std::cout << "Processing recharge request\n";
    std::cout << "Mobile: " << request.mobileNumber << "\n";
    std::cout << "Operator: " << request.operatorName << "\n";
    std::cout << "Amount: " << request.amount << "\n";

    // Future step: replace this delay with SIM modem/API command handling.
    std::this_thread::sleep_for(std::chrono::seconds(1));

    std::cout << "Status: QUEUED_FOR_GATEWAY\n";
    return true;
  }
};

int main() {
  RechargeRequest request{
      "9876543210",
      "Airtel",
      199,
  };

  RechargeGateway gateway;
  const bool accepted = gateway.process(request);

  return accepted ? 0 : 1;
}
