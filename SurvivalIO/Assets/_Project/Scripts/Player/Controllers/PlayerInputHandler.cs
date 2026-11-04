using UnityEngine;
#if ENABLE_INPUT_SYSTEM
using UnityEngine.InputSystem;
#endif

namespace SurvivalIO.Player
{
    /// <summary>
    /// Processes player movement and action inputs using Unity Input System.
    /// </summary>
    public class PlayerInputHandler : MonoBehaviour
    {
        [SerializeField] private Vector2 _moveInput;
        public Vector2 MoveInput => _moveInput;

        private void Update()
        {
#if ENABLE_INPUT_SYSTEM
            if (Keyboard.current != null)
            {
                float x = 0f;
                float y = 0f;
                if (Keyboard.current.aKey.isPressed || Keyboard.current.leftArrowKey.isPressed) x -= 1f;
                if (Keyboard.current.dKey.isPressed || Keyboard.current.rightArrowKey.isPressed) x += 1f;
                if (Keyboard.current.sKey.isPressed || Keyboard.current.downArrowKey.isPressed) y -= 1f;
                if (Keyboard.current.wKey.isPressed || Keyboard.current.upArrowKey.isPressed) y += 1f;

                _moveInput = new Vector2(x, y).normalized;
            }
#else
            float x = Input.GetAxisRaw("Horizontal");
            float y = Input.GetAxisRaw("Vertical");
            _moveInput = new Vector2(x, y).normalized;
#endif
        }

        public void SetInputVector(Vector2 input)
        {
            _moveInput = input.normalized;
        }
    }
}

