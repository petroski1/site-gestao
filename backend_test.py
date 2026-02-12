#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class FinControlAPITester:
    def __init__(self, base_url="https://budget-control-dash.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_result(self, test_name, success, status_code=None, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {test_name} - Passed")
        else:
            print(f"❌ {test_name} - Failed")
            if status_code:
                print(f"   Status: {status_code}")
            if details:
                print(f"   Details: {details}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "status_code": status_code,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            details = ""
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                details = f"Response: {response.text[:200]}"

            self.log_result(name, success, response.status_code, details)
            return success, response_data

        except Exception as e:
            self.log_result(name, False, None, str(e))
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        user_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "/auth/register",
            200,
            data=user_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            return True
        return False

    def test_user_login(self):
        """Test user login with registered credentials"""
        if not self.user_data:
            return False
            
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "/auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            return True
        return False

    def test_dashboard_stats(self):
        """Test dashboard statistics"""
        return self.run_test(
            "Dashboard Stats",
            "GET",
            "/dashboard/stats",
            200
        )[0]

    def test_create_transaction_entrada(self):
        """Test creating income transaction"""
        transaction_data = {
            "tipo": "entrada",
            "categoria": "Salário",
            "valor": 3500.00,
            "descricao": "Salário mensal teste",
            "data": "2024-12-01"
        }
        
        success, response = self.run_test(
            "Create Transaction (Entrada)",
            "POST",
            "/transactions",
            200,
            data=transaction_data
        )
        
        if success and 'id' in response:
            self.transaction_entrada_id = response['id']
            return True
        return False

    def test_create_transaction_saida(self):
        """Test creating expense transaction"""
        transaction_data = {
            "tipo": "saida",
            "categoria": "Alimentação",
            "valor": 150.50,
            "descricao": "Supermercado teste",
            "data": "2024-12-01"
        }
        
        success, response = self.run_test(
            "Create Transaction (Saída)",
            "POST",
            "/transactions",
            200,
            data=transaction_data
        )
        
        if success and 'id' in response:
            self.transaction_saida_id = response['id']
            return True
        return False

    def test_get_transactions(self):
        """Test retrieving transactions"""
        return self.run_test(
            "Get Transactions",
            "GET",
            "/transactions",
            200
        )[0]

    def test_delete_transaction(self):
        """Test deleting a transaction"""
        if hasattr(self, 'transaction_entrada_id'):
            return self.run_test(
                "Delete Transaction",
                "DELETE",
                f"/transactions/{self.transaction_entrada_id}",
                200
            )[0]
        return False

    def test_create_goal(self):
        """Test creating a financial goal"""
        goal_data = {
            "titulo": "Reserva de Emergência Teste",
            "valor_alvo": 10000.00,
            "prazo": "2024-12-31"
        }
        
        success, response = self.run_test(
            "Create Goal",
            "POST",
            "/goals",
            200,
            data=goal_data
        )
        
        if success and 'id' in response:
            self.goal_id = response['id']
            return True
        return False

    def test_update_goal_progress(self):
        """Test updating goal progress"""
        if hasattr(self, 'goal_id'):
            update_data = {"valor_atual": 2500.00}
            return self.run_test(
                "Update Goal Progress",
                "PUT",
                f"/goals/{self.goal_id}",
                200,
                data=update_data
            )[0]
        return False

    def test_get_goals(self):
        """Test retrieving goals"""
        return self.run_test(
            "Get Goals",
            "GET",
            "/goals",
            200
        )[0]

    def test_delete_goal(self):
        """Test deleting a goal"""
        if hasattr(self, 'goal_id'):
            return self.run_test(
                "Delete Goal",
                "DELETE",
                f"/goals/{self.goal_id}",
                200
            )[0]
        return False

    def test_get_investment_tips(self):
        """Test retrieving investment tips"""
        return self.run_test(
            "Get Investment Tips",
            "GET",
            "/investments/tips",
            200
        )[0]

    def test_get_profile(self):
        """Test retrieving user profile"""
        return self.run_test(
            "Get Profile",
            "GET",
            "/profile",
            200
        )[0]

    def test_update_profile(self):
        """Test updating user profile"""
        update_data = {"name": "Updated Test User"}
        return self.run_test(
            "Update Profile",
            "PUT",
            "/profile",
            200,
            data=update_data
        )[0]

    def test_export_xlsx(self):
        """Test Excel export functionality"""
        url = f"{self.base_url}/api/export/xlsx"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        print(f"\n🔍 Testing Excel Export...")
        
        try:
            response = requests.get(url, headers=headers, timeout=30)
            success = response.status_code == 200 and 'xlsx' in response.headers.get('content-type', '').lower()
            self.log_result("Excel Export", success, response.status_code)
            return success
        except Exception as e:
            self.log_result("Excel Export", False, None, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests in sequence"""
        print("🚀 Starting FinControl API Tests")
        print("=" * 50)

        # Authentication Tests
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return False

        # Dashboard Tests
        self.test_dashboard_stats()

        # Transaction Tests
        self.test_create_transaction_entrada()
        self.test_create_transaction_saida()
        self.test_get_transactions()
        self.test_delete_transaction()

        # Goal Tests
        self.test_create_goal()
        self.test_update_goal_progress()
        self.test_get_goals()
        self.test_delete_goal()

        # Investment Tests
        self.test_get_investment_tips()

        # Profile Tests
        self.test_get_profile()
        self.test_update_profile()

        # Export Tests
        self.test_export_xlsx()

        # Print Summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return success_rate >= 80

def main():
    tester = FinControlAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'tests_run': tester.tests_run,
                'tests_passed': tester.tests_passed,
                'success_rate': (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
            },
            'results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())