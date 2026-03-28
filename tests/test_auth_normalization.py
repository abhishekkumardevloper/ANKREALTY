from backend.main import UserRegister, UserLogin


def test_register_normalizes_email_role_and_trim_fields():
    user = UserRegister(
        email='  USER@Example.COM ',
        password='  pass1234 ',
        name=' Jane Doe ',
        phone=' 9876543210 ',
        role='User',
    )

    assert user.email == 'user@example.com'
    assert user.role == 'client'
    assert user.name == 'Jane Doe'
    assert user.phone == '9876543210'
    assert user.password == 'pass1234'


def test_login_normalizes_email_and_password():
    login = UserLogin(email='  USER@Example.COM ', password='  pass1234 ')

    assert login.email == 'user@example.com'
    assert login.password == 'pass1234'
