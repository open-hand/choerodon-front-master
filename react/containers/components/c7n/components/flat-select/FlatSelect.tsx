/* eslint-disable react/static-property-placement */
/* eslint-disable max-classes-per-file */
import React, {
  isValidElement, ReactNode, CSSProperties, forwardRef,
} from 'react';
import { observer } from 'mobx-react';
import { Icon, Animate, Select as SelectPro } from 'choerodon-ui/pro';
import isString from 'lodash/isString';
import noop from 'lodash/noop';
import isNil from 'lodash/isNil';
import classNames from 'classnames';
import { Select, SelectProps } from 'choerodon-ui/pro/lib/select/Select';
import { pxToRem, toPx } from 'choerodon-ui/lib/_util/UnitConvertor';
import measureTextWidth from 'choerodon-ui/pro/lib/_util/measureTextWidth';
import { stopPropagation } from 'choerodon-ui/pro/lib/_util/EventManager';
import './FlatSelect.less';
import { Tooltip } from 'choerodon-ui';
import useTheme from '@/hooks/useTheme';

const { Option, OptGroup } = Select;

class FlatSelect<T extends SelectProps> extends Select<T> {
  static defaultProps = {
    ...Select.defaultProps,
    dropdownMatchSelectWidth: false,
  };

  cache: Map<string, string>

  constructor(props: SelectProps, context: any) {
    super(props, context);
    this.cache = new Map();
  }

  getTriggerIconFont() {
    // return 'baseline-arrow_drop_down';
    return this.isFocus && this.searchable ? 'search' : 'baseline-arrow_drop_down';
  }

  // @ts-ignore
  getWrapperClassNames(...args): string {
    const { prefixCls, multiple, range } = this;
    const suffix = this.getSuffix();
    const prefix = this.getPrefix();
    return super.getWrapperClassNames(
      {
        'flat-select': true,
        [`${prefixCls}-empty`]: this.isEmpty(),
        // @ts-ignore
        [`${prefixCls}-suffix-button`]: isValidElement<{ onClick; }>(suffix),
        [`${prefixCls}-multiple`]: multiple,
        [`${prefixCls}-range`]: range,
        // @ts-ignore
        [`${prefixCls}-prefix-button`]: isValidElement<{ onClick; }>(prefix),
      },
      ...args,
    );
  }

  getInnerSpanButton(): ReactNode {
    const {
      props: { clearButton },
      prefixCls,
    } = this;
    if (clearButton && !this.isReadOnly()) {
      return this.wrapperInnerSpanButton(
        <Icon type="close" onClick={this.handleClearButtonClick} />,
        {
          className: `${prefixCls}-clear-button`,
        },
      );
    }
    return null;
  }

  renderMultipleHolder() {
    const { name, multiple } = this;
    const hasValue = !this.isEmpty();
    const placeholder = this.hasFloatLabel ? undefined : this.getPlaceholders()[0];
    const width = (hasValue ? 0 : measureTextWidth(placeholder || '') + 37);
    if (multiple) {
      return (
        <input
          key="value"
          className={`${this.prefixCls}-multiple-value`}
          value={this.toValueString(this.getValue()) || ''}
          name={name}
          onChange={noop}
          style={{ width }}
        />
      );
    }
    return undefined;
  }

  getMultipleText() {
    const values = this.getValues();
    const repeats: Map<any, number> = new Map<any, number>();
    const texts = values.map((v) => {
      if (this.cache.has(v)) {
        return this.cache.get(v);
      }
      const key = this.getValueKey(v);
      const repeat = repeats.get(key) || 0;
      const text = this.processText(this.getText(v));
      repeats.set(key, repeat + 1);
      if (!isNil(text)) {
        this.cache.set(v, text);
        return text;
      }
      return undefined;
    });
    return texts.join('，');
  }

  getPlaceholders(): string[] {
    const { placeholder } = this.props;
    if (this.isFocus && this.searchable) {
      return ['输入筛选条件'];
    }
    const holders: string[] = [];
    return placeholder ? holders.concat(placeholder!) : holders;
  }

  getEditor(): ReactNode {
    const {
      prefixCls,
      multiple,
      props: { style },
    } = this;
    const otherProps = this.getOtherProps();
    const { height } = (style || {}) as CSSProperties;
    if (multiple) {
      return (
        <div key="text" className={otherProps.className}>
          <Tooltip title={this.getMultipleText()}>
            <Animate
              component="ul"
              componentProps={{
                ref: this.saveTagContainer,
                onScroll: stopPropagation,
                style:
                  height && height !== 'auto' ? { height: pxToRem(toPx(height)! - 2) } : undefined,
              }}
              transitionName="zoom"
              exclusive
              onEnd={this.handleTagAnimateEnd}
              onEnter={this.handleTagAnimateEnter}
            >
              {this.renderMultipleValues()}
              {this.renderMultipleEditor({
                ...otherProps,
                className: `${prefixCls}-multiple-input`,
              } as T)}
            </Animate>
          </Tooltip>
        </div>
      );
    }
    const text = this.getTextNode();
    const finalText = isString(text) ? text : this.getText(this.getValue());
    const hasValue = this.getValue() !== undefined && this.getValue() !== null;
    const placeholder = this.hasFloatLabel
      ? undefined
      : this.getPlaceholders()[0];
    const { clearButton } = this.props;
    const width = (hasValue ? measureTextWidth(finalText) + (clearButton ? 52 : 35) : measureTextWidth(placeholder || '') + 32);
    if (isValidElement(text)) {
      otherProps.style = { ...otherProps.style, width, textIndent: -1000 };
    } else {
      otherProps.style = { width, ...otherProps.style };
    }
    if (!clearButton) {
      otherProps.className = classNames(otherProps.className, `${this.prefixCls}-no-clearButton`);
    }
    return (
      <input
        key="text"
        {...otherProps}
        placeholder={placeholder}
        value={finalText}
        readOnly={!this.editable}
      />
    );
  }
}

@observer
class ObserverFlatSelect extends FlatSelect<SelectProps> {
  static defaultProps = FlatSelect.defaultProps;

  static Option = Option;

  static OptGroup = OptGroup;
}
// @ts-ignore
const SelectWrapper: typeof ObserverFlatSelect = forwardRef((props: SelectProps, ref: React.Ref<SelectPro>) => {
  const theme = useTheme();
  const Component = SelectPro;

  return <Component ref={ref} {...props} />;
});

SelectWrapper.Option = Option;

SelectWrapper.OptGroup = OptGroup;
SelectWrapper.defaultProps = FlatSelect.defaultProps;
SelectWrapper.displayName = FlatSelect.displayName;
SelectWrapper.propTypes = FlatSelect.propTypes;
SelectWrapper.contextType = FlatSelect.contextType;

export default SelectWrapper;
